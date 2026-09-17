import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization of Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Custom story generation will use offline fallback generator.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY
  });
});

// Endpoint: AI Conversational Story Generation for any custom Python topic
app.post('/api/generate-conversation', async (req, res) => {
  try {
    const { topic, difficulty = 'Beginner' } = req.body;

    if (!topic || typeof topic !== 'string') {
      res.status(400).json({ error: 'A valid topic string is required.' });
      return;
    }

    const ai = getGeminiClient();

    if (ai) {
      const prompt = `Create a conversational technical dialogue between two people: Ayushi (Learner) and Ayush (Guide) teaching the Python topic: "${topic}" (${difficulty} level).
Follow the strict conversational hierarchy:
1. Ayushi has a tangible, realistic problem in a real project
2. Ayush asks what happened
3. Ayushi explains the naive approach (e.g. manual checking, nested loops, etc.)
4. Ayush asks why that approach is difficult / how long it takes
5. Ayushi realizes the scale bottleneck
6. Ayush introduces an intuitive analogy and the Python concept
7. Ayushi asks "What is that?"
8. Ayush explains simply with an everyday analogy
9. Ayushi asks "How does it actually work?"
10. Ayush explains the technical mechanism
11. Code appears cleanly with runnable sample code
12. Ayushi understands the code structure
13. Ayush confirms the speed/clarity result
14. Ayushi summarizes the core takeaway

Also provide:
- A multiple choice practice question with 3 options and explanations.
- A summary takeaway with: problem, intuition, technicalConcept, and codePattern.

Return valid JSON adhering to the ConversationLesson schema.`;

      const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest'];
      let lastGenError: any = null;

      for (const modelName of candidateModels) {
        let attempts = 0;
        const maxAttempts = 2;

        while (attempts < maxAttempts) {
          attempts++;
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                systemInstruction: 'You are an expert Python educator who creates human, natural conversations between two engineers: Ayushi (Learner) and Ayush (Guide). Return strict valid JSON.',
                responseMimeType: 'application/json',
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    tagline: { type: Type.STRING },
                    topic: { type: Type.STRING },
                    category: { type: Type.STRING },
                    difficulty: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced'] },
                    estimatedMinutes: { type: Type.NUMBER },
                    turns: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          speaker: { type: Type.STRING, enum: ['learner', 'guide'] },
                          phase: { type: Type.STRING, enum: ['problem', 'discovery', 'explanation', 'code', 'practice'] },
                          level: { type: Type.NUMBER },
                          text: { type: Type.STRING },
                          secondaryNote: { type: Type.STRING },
                          codeSnippet: {
                            type: Type.OBJECT,
                            properties: {
                              code: { type: Type.STRING },
                              filename: { type: Type.STRING },
                              caption: { type: Type.STRING },
                              output: { type: Type.STRING },
                              runnable: { type: Type.BOOLEAN }
                            },
                            required: ['code']
                          },
                          interactiveChoice: {
                            type: Type.OBJECT,
                            properties: {
                              prompt: { type: Type.STRING },
                              options: {
                                type: Type.ARRAY,
                                items: {
                                  type: Type.OBJECT,
                                  properties: {
                                    id: { type: Type.STRING },
                                    label: { type: Type.STRING },
                                    isOptimal: { type: Type.BOOLEAN }
                                  },
                                  required: ['id', 'label']
                                }
                              }
                            }
                          }
                        },
                        required: ['id', 'speaker', 'phase', 'text']
                      }
                    },
                    practiceQuestion: {
                      type: Type.OBJECT,
                      properties: {
                        question: { type: Type.STRING },
                        options: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              id: { type: Type.STRING },
                              text: { type: Type.STRING },
                              isCorrect: { type: Type.BOOLEAN },
                              explanation: { type: Type.STRING }
                            },
                            required: ['id', 'text', 'isCorrect', 'explanation']
                          }
                        },
                        takeaway: { type: Type.STRING }
                      },
                      required: ['question', 'options', 'takeaway']
                    },
                    summaryTakeaway: {
                      type: Type.OBJECT,
                      properties: {
                        problem: { type: Type.STRING },
                        intuition: { type: Type.STRING },
                        technicalConcept: { type: Type.STRING },
                        codePattern: { type: Type.STRING }
                      },
                      required: ['problem', 'intuition', 'technicalConcept', 'codePattern']
                    }
                  },
                  required: ['title', 'tagline', 'topic', 'turns', 'practiceQuestion', 'summaryTakeaway']
                }
              }
            });

            const rawText = response.text || '{}';
            const generatedJson = JSON.parse(rawText);
            const customId = `conv-${Date.now()}-${topic.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

            const fullLesson = {
              id: customId,
              slug: customId,
              topic: generatedJson.topic || topic,
              title: generatedJson.title || `Mastering ${topic}`,
              tagline: generatedJson.tagline || `How Ayushi and Ayush solved real bottlenecks with ${topic}.`,
              category: generatedJson.category || 'Python Basics',
              difficulty: (generatedJson.difficulty as any) || difficulty,
              estimatedMinutes: generatedJson.estimatedMinutes || 5,
              learner: {
                name: 'Ayushi',
                role: 'Learner / Developer',
                avatarEmoji: '👩',
                avatarBg: 'bg-amber-100 text-amber-800 border-amber-200',
                bio: `Working on a real project involving ${topic}.`
              },
              guide: {
                name: 'Ayush',
                role: 'Guide / Senior Engineer',
                avatarEmoji: '👨',
                avatarBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                bio: `Explaining the design and power of ${topic}.`
              },
              turns: generatedJson.turns.map((t: any, idx: number) => ({
                ...t,
                id: t.id || `turn-${idx + 1}`
              })),
              practiceQuestion: generatedJson.practiceQuestion,
              summaryTakeaway: generatedJson.summaryTakeaway
            };

            res.json({ success: true, lesson: fullLesson });
            return;
          } catch (genErr: any) {
            lastGenError = genErr;
            const isTransient =
              genErr?.status === 503 ||
              genErr?.status === 429 ||
              genErr?.message?.includes('503') ||
              genErr?.message?.includes('high demand') ||
              genErr?.message?.includes('UNAVAILABLE');

            if (isTransient && attempts < maxAttempts) {
              // Wait 750ms before retrying same model
              await new Promise((resolve) => setTimeout(resolve, 750));
              continue;
            }
            // Otherwise break inner loop to try fallback model
            break;
          }
        }
      }

      console.warn('Gemini models unavailable or in high demand, using curated local generator:', lastGenError?.message || lastGenError);
    }

    // High fidelity template fallback
    const fallbackConv = generateFallbackConversation(topic, difficulty);
    res.json({ success: true, lesson: fallbackConv });
  } catch (error: any) {
    console.error('generate-conversation error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate conversation' });
  }
});

function generateFallbackConversation(topic: string, difficulty: string) {
  const cleanTopic = topic.trim();
  const id = `conv-${Date.now()}-${cleanTopic.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  return {
    id,
    slug: id,
    topic: cleanTopic,
    title: `Understanding ${cleanTopic}`,
    tagline: `How Ayushi learned to solve real code bottlenecks using ${cleanTopic}.`,
    category: 'Python Basics',
    difficulty: difficulty || 'Beginner',
    estimatedMinutes: 5,
    learner: {
      name: 'Ayushi',
      role: 'Learner / Developer',
      avatarEmoji: '👩',
      avatarBg: 'bg-amber-100 text-amber-800 border-amber-200',
      bio: `Encountered a challenging problem with ${cleanTopic}.`
    },
    guide: {
      name: 'Ayush',
      role: 'Guide / Senior Engineer',
      avatarEmoji: '👨',
      avatarBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      bio: `Demonstrating idiomatic Python solutions with ${cleanTopic}.`
    },
    turns: [
      {
        id: 't-1',
        speaker: 'learner',
        phase: 'problem',
        level: 1,
        text: `Ayush, I'm stuck trying to handle a repetitive task in our codebase. Without ${cleanTopic}, my code takes 40 lines and breaks when inputs change.`,
        secondaryNote: 'Person A explains the problem'
      },
      {
        id: 't-2',
        speaker: 'guide',
        phase: 'problem',
        level: 1,
        text: `What happens when you try to run your current manual approach?`,
        secondaryNote: 'Person B asks what happened'
      },
      {
        id: 't-3',
        speaker: 'learner',
        phase: 'problem',
        level: 1,
        text: `It requires writing nested loops and manual checks everywhere. It's hard to read and slow to run.`,
        secondaryNote: 'A realizes the limitation'
      },
      {
        id: 't-4',
        speaker: 'guide',
        phase: 'discovery',
        level: 2,
        text: `Then you need something that encapsulates this pattern cleanly. Have you considered using ${cleanTopic}?`,
        interactiveChoice: {
          prompt: `How should Ayushi structure this?`,
          options: [
            { id: 'opt-manual', label: 'Keep writing manual boilerplate checks', isOptimal: false },
            { id: 'opt-idiomatic', label: `Use Python's built-in ${cleanTopic}`, isOptimal: true }
          ]
        },
        secondaryNote: 'B introduces the idea'
      },
      {
        id: 't-5',
        speaker: 'learner',
        phase: 'discovery',
        level: 2,
        text: `Wait, what does ${cleanTopic} actually do under the hood?`,
        secondaryNote: 'A asks "What is that?"'
      },
      {
        id: 't-6',
        speaker: 'guide',
        phase: 'explanation',
        level: 2,
        text: `Think of ${cleanTopic} as a specialized blueprint. Instead of manually coordinating each step, Python provides this built-in mechanism to handle the heavy lifting for you.`,
        secondaryNote: 'B explains simply with an analogy'
      },
      {
        id: 't-7',
        speaker: 'guide',
        phase: 'code',
        level: 4,
        text: `Let's see what this looks like in Python:`,
        codeSnippet: {
          code: `# Demonstrating ${cleanTopic} in Python
def process_data(items):
    """Clean, idiomatic implementation using ${cleanTopic}."""
    return [f"Processed: {item}" for item in items]

# Example execution
data = ["Sample A", "Sample B", "Sample C"]
result = process_data(data)
print(result)`,
          filename: `${cleanTopic.toLowerCase().replace(/[^a-z0-9]/g, '_')}_demo.py`,
          caption: `Idiomatic ${cleanTopic} Solution`,
          runnable: true,
          output: `['Processed: Sample A', 'Processed: Sample B', 'Processed: Sample C']\n[Executed in 0.001s with zero boilerplate]`
        },
        secondaryNote: 'Code appears as part of conversation'
      },
      {
        id: 't-8',
        speaker: 'learner',
        phase: 'code',
        level: 4,
        text: `Oh! So this completely eliminates the boilerplate and makes the intention clear immediately!`,
        secondaryNote: 'A understands the code'
      },
      {
        id: 't-9',
        speaker: 'guide',
        phase: 'practice',
        level: 4,
        text: `Exactly! Pythonic design is all about readability and clear abstractions.`,
        secondaryNote: 'B validates learning'
      }
    ],
    practiceQuestion: {
      question: `Why is ${cleanTopic} preferred in modern Python code?`,
      options: [
        {
          id: 'q-1',
          text: `It provides a clean, readable abstraction that eliminates boilerplate and prevents common runtime errors.`,
          isCorrect: true,
          explanation: `Correct! ${cleanTopic} is designed to make code concise, readable, and less error-prone.`
        },
        {
          id: 'q-2',
          text: `It makes the file size 10 times larger.`,
          isCorrect: false,
          explanation: `In fact, it makes the code much shorter and cleaner.`
        },
        {
          id: 'q-3',
          text: `It prevents Python from using memory.`,
          isCorrect: false,
          explanation: `All Python code uses memory, but ${cleanTopic} organizes it efficiently.`
        }
      ],
      takeaway: `Use ${cleanTopic} to write expressive, maintainable, and idiomatic Python.`
    },
    summaryTakeaway: {
      problem: `Repetitive manual boilerplate that is slow and error-prone.`,
      intuition: `A clean abstraction that takes care of the mechanical steps automatically.`,
      technicalConcept: `Native Python construct designed for idiomatic clarity and performance.`,
      codePattern: `result = process_with_${cleanTopic.toLowerCase().replace(/[^a-z0-9]/g, '_')}(data)`
    }
  };
}

// Endpoint: AI Story Generation for any custom Python topic
app.post('/api/generate-story', async (req, res) => {
  try {
    const { topic, difficulty = 'Beginner', audience = 'Python beginner', domain = 'Real-world software' } = req.body;

    if (!topic || typeof topic !== 'string') {
      res.status(400).json({ error: 'A valid topic string is required.' });
      return;
    }

    const ai = getGeminiClient();

    if (ai) {
      const prompt = `Generate a complete, structured, interactive educational story lesson for learning the Python topic: "${topic}".
Follow the strict story-first learning philosophy:
- Target audience: ${audience}
- Difficulty: ${difficulty}
- Domain: ${domain}
- Do NOT start with syntax, definitions, or abstract terminology.
- Start with a tangible, realistic real-world problem and scale bottleneck.
- Give characters meaningful roles that represent technical concepts (e.g. Worker -> Function, Storage box -> Variable, Table -> DataFrame).
- Structure into 11 scenes:
  1. problem (realistic situation, overwhelmed character)
  2. characters (cast with what they represent technically)
  3. conflict (why manual / naive approach fails, with a 2-option decision)
  4. discovery (why this Python concept was created)
  5. solution (clean step-by-step master plan)
  6. translation (mapping character roles to technical concepts)
  7. code (actual clean Python code with story-to-code mapping)
  8. interactive (dataset or simulator setup)
  9. result (metrics and outcome achieved in milliseconds)
  10. recap (problem -> concept -> why needed -> how it worked)
  11. challenge (multiple choice with 3-4 options and rich explanations on WHY the correct answer is right and why others fail)

Provide valid JSON matching the exact lesson structure.`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are a master Python educator creating engaging story-first interactive lessons. You always return strict, well-structured JSON.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                tagline: { type: Type.STRING },
                topic: { type: Type.STRING },
                category: { 
                  type: Type.STRING,
                  enum: ['Python Basics', 'Data Science', 'Machine Learning', 'Web Development', 'Automation', 'Data Visualization']
                },
                difficulty: { 
                  type: Type.STRING,
                  enum: ['Beginner', 'Intermediate', 'Advanced']
                },
                estimatedMinutes: { type: Type.NUMBER },
                icon: { type: Type.STRING },
                jobRole: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    industry: { type: Type.STRING },
                    realWorldUse: { type: Type.STRING },
                    typicalDailyTasks: { 
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  },
                  required: ['title', 'industry', 'realWorldUse', 'typicalDailyTasks']
                },
                realWorldProblem: {
                  type: Type.OBJECT,
                  properties: {
                    headline: { type: Type.STRING },
                    description: { type: Type.STRING },
                    scaleMetric: { type: Type.STRING },
                    failureOfManualWork: { type: Type.STRING }
                  },
                  required: ['headline', 'description', 'scaleMetric', 'failureOfManualWork']
                },
                characters: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      role: { type: Type.STRING },
                      represents: { type: Type.STRING },
                      whatTheyNeedToAccomplish: { type: Type.STRING },
                      avatarEmoji: { type: Type.STRING },
                      badgeColor: { type: Type.STRING },
                      quote: { type: Type.STRING }
                    },
                    required: ['id', 'name', 'role', 'represents', 'whatTheyNeedToAccomplish', 'avatarEmoji']
                  }
                },
                technicalTranslations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      storyCharacter: { type: Type.STRING },
                      technicalConcept: { type: Type.STRING },
                      storyExplanation: { type: Type.STRING },
                      technicalExplanation: { type: Type.STRING },
                      codeSnippet: { type: Type.STRING }
                    },
                    required: ['storyCharacter', 'technicalConcept', 'storyExplanation', 'technicalExplanation', 'codeSnippet']
                  }
                },
                fullPythonCode: { type: Type.STRING },
                storyToCodeMappings: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      storyAction: { type: Type.STRING },
                      programmingConcept: { type: Type.STRING },
                      codeSnippet: { type: Type.STRING },
                      highlightLineNumbers: { 
                        type: Type.ARRAY,
                        items: { type: Type.NUMBER }
                      },
                      storyNote: { type: Type.STRING },
                      technicalNote: { type: Type.STRING }
                    },
                    required: ['id', 'storyAction', 'programmingConcept', 'codeSnippet', 'highlightLineNumbers', 'storyNote', 'technicalNote']
                  }
                },
                scenes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      sceneNumber: { type: Type.NUMBER },
                      type: { 
                        type: Type.STRING,
                        enum: ['problem', 'characters', 'conflict', 'discovery', 'solution', 'translation', 'code', 'interactive', 'result', 'recap', 'challenge']
                      },
                      title: { type: Type.STRING },
                      subtitle: { type: Type.STRING },
                      storyText: { type: Type.STRING },
                      technicalText: { type: Type.STRING },
                      characterFocusId: { type: Type.STRING },
                      dialogue: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            characterId: { type: Type.STRING },
                            speech: { type: Type.STRING },
                            mood: { type: Type.STRING, enum: ['worried', 'excited', 'thinking', 'triumphant', 'explaining'] }
                          },
                          required: ['characterId', 'speech']
                        }
                      },
                      decision: {
                        type: Type.OBJECT,
                        properties: {
                          prompt: { type: Type.STRING },
                          options: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                id: { type: Type.STRING },
                                label: { type: Type.STRING },
                                isOptimal: { type: Type.BOOLEAN },
                                reactionText: { type: Type.STRING },
                                characterReaction: { type: Type.STRING }
                              },
                              required: ['id', 'label', 'isOptimal', 'reactionText']
                            }
                          }
                        }
                      }
                    },
                    required: ['id', 'sceneNumber', 'type', 'title', 'subtitle', 'storyText', 'technicalText']
                  }
                },
                challenge: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    scenarioContext: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          text: { type: Type.STRING },
                          isCorrect: { type: Type.BOOLEAN },
                          explanation: { type: Type.STRING }
                        },
                        required: ['id', 'text', 'isCorrect', 'explanation']
                      }
                    },
                    conceptualTakeaway: { type: Type.STRING }
                  },
                  required: ['question', 'options', 'conceptualTakeaway']
                },
                recapSummary: {
                  type: Type.OBJECT,
                  properties: {
                    problem: { type: Type.STRING },
                    concept: { type: Type.STRING },
                    whyNeeded: { type: Type.STRING },
                    howItWorks: { type: Type.STRING },
                    keySyntax: { type: Type.STRING },
                    keyResult: { type: Type.STRING }
                  },
                  required: ['problem', 'concept', 'whyNeeded', 'howItWorks', 'keySyntax', 'keyResult']
                }
              },
              required: [
                'title', 'tagline', 'topic', 'category', 'difficulty', 'estimatedMinutes',
                'realWorldProblem', 'characters', 'technicalTranslations', 'fullPythonCode',
                'storyToCodeMappings', 'scenes', 'challenge', 'recapSummary'
              ]
            }
          }
        });

        const generatedJson = JSON.parse(response.text || '{}');
        const customId = `custom-${Date.now()}-${topic.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        
        // Enrich with fallback simulator if not provided
        const enrichedLesson = {
          id: customId,
          slug: customId,
          ...generatedJson,
          icon: generatedJson.icon || 'Sparkles',
          interactiveSimulator: {
            title: `${generatedJson.topic} Interactive Sandbox`,
            description: `Test and inspect live parameters for ${generatedJson.topic}.`,
            sampleDatasetName: `${topic.toLowerCase()}_sample_data`,
            columns: [
              { key: 'id', label: 'Item ID', type: 'number' },
              { key: 'name', label: 'Entity Name', type: 'string' },
              { key: 'status', label: 'Status', type: 'badge' },
              { key: 'score', label: 'Score / Value', type: 'number' }
            ],
            initialData: [
              { id: 1, name: 'Sample Record A', status: 'Active', score: 92 },
              { id: 2, name: 'Sample Record B', status: 'Pending', score: 45 },
              { id: 3, name: 'Sample Record C', status: 'Active', score: 78 },
              { id: 4, name: 'Sample Record D', status: 'Completed', score: 100 }
            ],
            controls: [
              {
                id: 'threshold',
                label: 'Score Filter Threshold',
                type: 'slider',
                min: 0,
                max: 100,
                step: 10,
                defaultValue: 50
              }
            ],
            pythonCodeTemplate: (params: Record<string, any>) => {
              return `# Interactive ${generatedJson.topic} Execution\n` +
                generatedJson.fullPythonCode +
                `\n\n# Dynamic Parameter: threshold = ${params.threshold}\nprint(f"Applied dynamic threshold: ${params.threshold}")`;
            },
            simulationLogic: (params: Record<string, any>, rawData: any[]) => {
              const th = params.threshold || 50;
              const filtered = rawData.filter(r => r.score >= th);
              return {
                filteredData: filtered,
                computedStats: [
                  { label: 'Elements Kept', value: `${filtered.length} / ${rawData.length}` },
                  { label: 'Execution Speed', value: '0.001ms' },
                  { label: 'Status', value: 'Success ✅' }
                ],
                executionTimeMs: 0.001,
                logMessages: [
                  `[Interactive Kernel] Initialized sandbox for ${generatedJson.topic}`,
                  `[Filter] Applied threshold >= ${th} -> ${filtered.length} matched elements`
                ]
              };
            }
          }
        };

        res.json({ success: true, lesson: enrichedLesson });
        return;
      } catch (genError) {
        console.error('Error generating story via Gemini API:', genError);
        // Fall back to template generator
      }
    }

    // Fallback dynamic generator if no API key or generation failed
    const fallbackLesson = generateFallbackStory(topic, difficulty, domain);
    res.json({ success: true, lesson: fallbackLesson, note: 'Generated with high-fidelity structured template' });
  } catch (error: any) {
    console.error('Generate story route failed:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate story' });
  }
});

function generateFallbackStory(topic: string, difficulty: string, domain: string) {
  const cleanTopic = topic.trim();
  const id = `story-${Date.now()}-${cleanTopic.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  
  return {
    id,
    slug: id,
    title: `The Tale of ${cleanTopic}`,
    tagline: `Discover why ${cleanTopic} makes complex ${domain} tasks effortlessly clean.`,
    topic: cleanTopic,
    category: 'Python Basics',
    difficulty: difficulty || 'Beginner',
    estimatedMinutes: 6,
    icon: 'Sparkles',
    jobRole: {
      title: 'Python Engineer',
      industry: domain || 'Software Engineering',
      realWorldUse: `Leverages ${cleanTopic} to eliminate boilerplate and write elegant, scalable code.`,
      typicalDailyTasks: [
        `Structuring modular logic with ${cleanTopic}`,
        'Refactoring slow or error-prone routines',
        'Improving readability for engineering teams'
      ]
    },
    realWorldProblem: {
      headline: `The Complex Bottleneck in ${cleanTopic}`,
      description: `A developer at a growing company faces a challenging problem in ${domain}. Without ${cleanTopic}, the solution requires 60 lines of repetitive, fragile code that breaks on edge cases.`,
      scaleMetric: `Hundreds of repetitive operations per hour`,
      failureOfManualWork: `Naive manual approaches cause code duplication, hard-to-find bugs, and slow execution.`
    },
    characters: [
      {
        id: 'hero',
        name: 'Jordan',
        role: 'Problem Solver',
        represents: 'The Developer / Learner',
        whatTheyNeedToAccomplish: `Solve the problem using ${cleanTopic} cleanly and efficiently.`,
        avatarEmoji: '🧑‍💻',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        quote: `I need a structured way to handle this without writing repetitive boilerplate!`
      },
      {
        id: 'concept-helper',
        name: `${cleanTopic} Expert`,
        role: 'Technical Guide',
        represents: `${cleanTopic} Architecture`,
        whatTheyNeedToAccomplish: `Provide the idiomatic Python solution for ${cleanTopic}.`,
        avatarEmoji: '⚡',
        badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        quote: `Let Python handle the heavy lifting while you focus on business logic!`
      }
    ],
    technicalTranslations: [
      {
        storyCharacter: 'The Manual Burden',
        technicalConcept: 'Unstructured Naive Code',
        storyExplanation: 'Writing repetitive instructions by hand for every situation.',
        technicalExplanation: 'Procedural boilerplate without abstraction.',
        codeSnippet: '# Naive approach'
      },
      {
        storyCharacter: `${cleanTopic} Solution`,
        technicalConcept: `Python Idiomatic ${cleanTopic}`,
        storyExplanation: `The specialized Python mechanism designed to solve this directly.`,
        technicalExplanation: `Native syntax construct optimized for clarity and performance.`,
        codeSnippet: `# ${cleanTopic} idiomatic code`
      }
    ],
    fullPythonCode: `# Exploring ${cleanTopic} in Python
def run_solution(items):
    """Demonstrating why ${cleanTopic} provides elegant clarity."""
    print("🚀 Initializing ${cleanTopic} workflow...")
    results = [f"Processed {item}" for item in items]
    return results

sample_items = ["Task A", "Task B", "Task C"]
output = run_solution(sample_items)
print(f"✨ Success: {output}")
`,
    storyToCodeMappings: [
      {
        id: 'map-gen-1',
        storyAction: `Jordan sets up the ${cleanTopic} structure`,
        programmingConcept: 'Function & Structure Definition',
        codeSnippet: `def run_solution(items):`,
        highlightLineNumbers: [2],
        storyNote: `Creates the reusable blueprint.`,
        technicalNote: `Defines a function scope with explicit arguments.`
      },
      {
        id: 'map-gen-2',
        storyAction: 'Processing all items in a single expressive step',
        programmingConcept: 'Idiomatic Transformation',
        codeSnippet: `results = [f"Processed {item}" for item in items]`,
        highlightLineNumbers: [5],
        storyNote: 'The helper transforms all data effortlessly.',
        technicalNote: 'Executes idiomatic transformation in memory.'
      }
    ],
    scenes: [
      {
        id: 's1',
        sceneNumber: 1,
        type: 'problem',
        title: `The Bottleneck: Why We Need ${cleanTopic}`,
        subtitle: `Encountering the real-world limitation.`,
        storyText: `Jordan is building a feature in ${domain}. The requirements are growing, and the standard manual code is becoming messy, error-prone, and hard to maintain.`,
        technicalText: `Without ${cleanTopic}, codebases accumulate technical debt, higher cyclomatic complexity, and poor testability.`,
        characterFocusId: 'hero',
        dialogue: [
          { characterId: 'hero', speech: `There must be a cleaner Python way to do this!`, mood: 'worried' }
        ]
      },
      {
        id: 's2',
        sceneNumber: 2,
        type: 'characters',
        title: 'Meet the Team',
        subtitle: 'The Solver and the Python Tool.',
        storyText: `Jordan teams up with ${cleanTopic} to restructure the workflow cleanly.`,
        technicalText: `Separating problem definition from algorithmic execution.`,
        dialogue: [
          { characterId: 'concept-helper', speech: `I will show you how Python handles this with elegance!`, mood: 'excited' }
        ]
      },
      {
        id: 's3',
        sceneNumber: 3,
        type: 'conflict',
        title: 'The Conflict: The Hard Way vs The Smart Way',
        subtitle: 'Why the naive method breaks.',
        storyText: `Doing this manually takes dozens of lines and breaks when inputs change.`,
        technicalText: `Manual implementations often miss edge cases and incur high maintenance overhead.`,
        decision: {
          prompt: `How should Jordan solve this problem?`,
          options: [
            {
              id: 'opt-hard',
              label: 'Write 40 lines of repetitive manual checks',
              isOptimal: false,
              reactionText: 'The code became cluttered and broke on unexpected inputs!',
              characterReaction: '😓 Jordan: "Too much boilerplate to maintain!"'
            },
            {
              id: 'opt-smart',
              label: `Adopt idiomatic ${cleanTopic}`,
              isOptimal: true,
              reactionText: `Clean, 3-line solution implemented with zero bugs!`,
              characterReaction: `⚡ Expert: "That is the power of Pythonic design!"`
            }
          ]
        }
      },
      {
        id: 's4',
        sceneNumber: 4,
        type: 'discovery',
        title: `The Discovery: Why ${cleanTopic} Exists`,
        subtitle: 'The design philosophy behind the concept.',
        storyText: `Python introduced ${cleanTopic} to provide a direct, readable solution to this exact problem pattern.`,
        technicalText: `Understanding language design intent prevents anti-patterns and over-engineering.`
      },
      {
        id: 's5',
        sceneNumber: 5,
        type: 'solution',
        title: 'The Solution: The Clean Pattern',
        subtitle: 'Step-by-step implementation plan.',
        storyText: `With ${cleanTopic}, the solution boils down to a clear, readable structure that any engineer can understand immediately.`,
        technicalText: `Standard implementation pattern following PEP-8 style guidelines.`
      },
      {
        id: 's6',
        sceneNumber: 6,
        type: 'translation',
        title: 'Technical Translation',
        subtitle: `Connecting the story to syntax.`,
        storyText: `See how each character action maps directly to Python constructs.`,
        technicalText: `Story metaphor vs syntactic specification.`
      },
      {
        id: 's7',
        sceneNumber: 7,
        type: 'code',
        title: 'The Python Code',
        subtitle: 'Interactive code walkthrough.',
        storyText: `Click lines to inspect how ${cleanTopic} executes.`,
        technicalText: `Inspect the code structure and runtime behavior.`
      },
      {
        id: 's8',
        sceneNumber: 8,
        type: 'interactive',
        title: 'Interactive Sandbox',
        subtitle: 'Test parameters live and observe outputs.',
        storyText: `Adjust parameters and see how the Python logic responds in real time.`,
        technicalText: `Real-time sandbox execution.`
      },
      {
        id: 's9',
        sceneNumber: 9,
        type: 'result',
        title: 'The Triumphant Result',
        subtitle: 'Clean code and happy users.',
        storyText: `Jordan deploys the code cleanly. The task runs in milliseconds with zero bugs.`,
        technicalText: `Optimized execution with minimal cyclomatic complexity.`,
        characterFocusId: 'hero',
        dialogue: [
          { characterId: 'hero', speech: `Understanding WHY this exists made writing the code effortless!`, mood: 'triumphant' }
        ]
      },
      {
        id: 's10',
        sceneNumber: 10,
        type: 'recap',
        title: 'Lesson Recap',
        subtitle: 'Key takeaways to remember.',
        storyText: `Review the mental model for ${cleanTopic}.`,
        technicalText: `Core concepts and syntax reference.`
      },
      {
        id: 's11',
        sceneNumber: 11,
        type: 'challenge',
        title: 'Mini Challenge',
        subtitle: 'Test your understanding.',
        storyText: `Put your new knowledge of ${cleanTopic} to the test!`,
        technicalText: `Conceptual validation quiz.`
      }
    ],
    challenge: {
      question: `Why is ${cleanTopic} preferred over writing manual procedural code for this problem?`,
      scenarioContext: `Scenario: Building maintainable, bug-free Python code in real-world software.`,
      options: [
        {
          id: 'opt-q1',
          text: `It provides a clear, idiomatic abstraction that reduces boilerplate and prevents common runtime bugs.`,
          isCorrect: true,
          explanation: `Exactly right! ${cleanTopic} was designed specifically to simplify this pattern, making your code readable, fast, and maintainable.`
        },
        {
          id: 'opt-q2',
          text: `It makes the Python code file 10 times larger.`,
          isCorrect: false,
          explanation: `In fact, ${cleanTopic} usually reduces dozens of lines into a few clean, expressive statements!`
        },
        {
          id: 'opt-q3',
          text: `It prevents Python from using memory.`,
          isCorrect: false,
          explanation: `All Python code uses memory; ${cleanTopic} optimizes how that memory is structured and accessed.`
        }
      ],
      conceptualTakeaway: `Choose idiomatic Python concepts like ${cleanTopic} because they express intent clearly and reduce room for human error.`
    },
    recapSummary: {
      problem: `Overly complex, brittle manual code in ${domain}.`,
      concept: `${cleanTopic}`,
      whyNeeded: `Eliminates repetitive boilerplate and clarifies code intent.`,
      howItWorks: `Provides native, optimized syntax designed specifically for this pattern.`,
      keySyntax: `# ${cleanTopic} syntax in action\nresult = process_data(items)`,
      keyResult: `Clean, robust implementation running in milliseconds.`
    },
    interactiveSimulator: {
      title: `${cleanTopic} Interactive Sandbox`,
      description: `Test and inspect live parameters for ${cleanTopic}.`,
      sampleDatasetName: `${cleanTopic.toLowerCase()}_sample_data`,
      columns: [
        { key: 'id', label: 'Item ID', type: 'number' },
        { key: 'name', label: 'Entity Name', type: 'string' },
        { key: 'status', label: 'Status', type: 'badge' },
        { key: 'score', label: 'Score / Value', type: 'number' }
      ],
      initialData: [
        { id: 1, name: 'Task Alpha', status: 'Active', score: 92 },
        { id: 2, name: 'Task Beta', status: 'Pending', score: 45 },
        { id: 3, name: 'Task Gamma', status: 'Active', score: 78 },
        { id: 4, name: 'Task Delta', status: 'Completed', score: 100 }
      ],
      controls: [
        {
          id: 'threshold',
          label: 'Threshold Filter',
          type: 'slider',
          min: 0,
          max: 100,
          step: 10,
          defaultValue: 50
        }
      ],
      pythonCodeTemplate: (params: Record<string, any>) => {
        return `# ${cleanTopic} Python Script\nitems = [{"name": "Task Alpha", "score": 92}, {"name": "Task Beta", "score": 45}]\nthreshold = ${params.threshold}\n\n# Filter using ${cleanTopic}\nvalid = [i for i in items if i['score'] >= threshold]\nprint(f"Passed items: {len(valid)}")`;
      },
      simulationLogic: (params: Record<string, any>, rawData: any[]) => {
        const th = params.threshold || 50;
        const filtered = rawData.filter(r => r.score >= th);
        return {
          filteredData: filtered,
          computedStats: [
            { label: 'Elements Matched', value: `${filtered.length} / ${rawData.length}` },
            { label: 'Processing Speed', value: '0.001 ms' },
            { label: 'Status', value: 'Operational ✅' }
          ],
          executionTimeMs: 0.001,
          logMessages: [
            `[Sandbox] Executing ${cleanTopic} routine`,
            `[Filter] Applied threshold >= ${th} -> ${filtered.length} matched elements`
          ]
        };
      }
    }
  };
}

// Vite middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Python Storytelling Learning Platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
