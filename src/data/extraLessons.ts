import { Lesson } from '../types';

export const REQUESTS_API_LESSON: Lesson = {
  id: 'requests-weather-dispatcher',
  slug: 'requests-weather-dispatcher',
  title: 'The Sky Dispatcher & The Live Web API',
  tagline: 'How programs talk across the globe over HTTP to fetch live data in seconds.',
  topic: 'Requests & Web APIs',
  category: 'Web Development',
  difficulty: 'Beginner',
  estimatedMinutes: 7,
  icon: 'Globe',
  
  jobRole: {
    title: 'Full-Stack / API Developer',
    industry: 'Cloud Software & Travel Tech',
    realWorldUse: 'Integrates 3rd-party services (weather, payments, AI, maps) over HTTP REST APIs.',
    typicalDailyTasks: [
      'Querying live payment gateways (Stripe)',
      'Fetching live flight status radar from airport servers',
      'Handling HTTP 200 OK responses and 404/500 errors'
    ]
  },

  realWorldProblem: {
    headline: 'Fetching Live Storm Radar from the Airport Tower',
    description: 'Pilot Clara is preparing for takeoff in stormy weather. She needs real-time wind speed from the control tower 50 miles away. She cannot walk there, and she cannot hardcode yesterday\'s weather into her flight computer. She needs her computer to call the tower\'s API over HTTP, get JSON data, and verify the storm has cleared.',
    scaleMetric: 'Live external web servers queried over network protocols',
    failureOfManualWork: 'Hardcoded local values become obsolete immediately; manual phone calls delay takeoff.'
  },

  characters: [
    {
      id: 'clara',
      name: 'Pilot Clara',
      role: 'Flight Navigator',
      represents: 'The Client Program (`requests.get`)',
      whatTheyNeedToAccomplish: 'Send an HTTP request to the weather server and receive live JSON telemetry.',
      avatarEmoji: '👩‍✈️',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      quote: 'Tower, do you read me? Send me current wind speed and storm alerts for runway 24!'
    },
    {
      id: 'weather-tower',
      name: 'Tower API',
      role: 'Web Server / Endpoint',
      represents: 'REST API Server (`https://api.weather.com/v1/forecast`)',
      whatTheyNeedToAccomplish: 'Validate the request, generate response status 200 OK, and send JSON data.',
      avatarEmoji: '📡',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      quote: 'Request received! Status 200 OK: Returning wind: 14kts, visibility: 10mi, rain: False.'
    }
  ],

  technicalTranslations: [
    {
      storyCharacter: 'Radio Dispatcher Clara',
      technicalConcept: 'HTTP Client (`import requests`)',
      storyExplanation: 'The messenger sending outgoing requests over the internet wire.',
      technicalExplanation: 'A Python library that abstracts socket connections, headers, and HTTP methods.',
      codeSnippet: 'import requests'
    },
    {
      storyCharacter: 'The Tower Radio Frequency',
      technicalConcept: 'URL Endpoint',
      storyExplanation: 'The exact digital address where the service listens for questions.',
      technicalExplanation: 'Uniform Resource Identifier (URI) with protocol, domain, and route.',
      codeSnippet: "url = 'https://api.weather.com/v1/radar'"
    },
    {
      storyCharacter: 'The Status Code & Weather Envelope',
      technicalConcept: 'HTTP Response & JSON Payload',
      storyExplanation: 'The return package with a stamp (200 OK) and structured data inside.',
      technicalExplanation: 'HTTP status code plus serialized JSON converted to Python dict via .json().',
      codeSnippet: 'data = response.json()'
    }
  ],

  fullPythonCode: `import requests

# 1. Target the airport weather endpoint
url = 'https://api.skyradar.com/v1/airport/SEA'
params = {'units': 'knots', 'alerts': 'true'}

# 2. Dispatch HTTP GET request
response = requests.get(url, params=params)

# 3. Verify server status
if response.status_code == 200:
    weather_data = response.json()
    wind_speed = weather_data['wind_speed']
    is_safe = weather_data['safe_for_takeoff']
    print(f"✈️ Status 200 OK: Wind is {wind_speed} knots. Safe to fly? {is_safe}")
else:
    print(f"⚠️ Tower error: Status code {response.status_code}")
`,

  storyToCodeMappings: [
    {
      id: 'req-map-1',
      storyAction: 'Clara dials the Tower URL',
      programmingConcept: 'HTTP GET Request',
      codeSnippet: 'response = requests.get(url, params=params)',
      highlightLineNumbers: [7],
      storyNote: 'Dispatches the digital messenger over the network to the server.',
      technicalNote: 'Sends an HTTP GET command over TCP/IP with query parameters.'
    },
    {
      id: 'req-map-2',
      storyAction: 'Checking the 200 OK stamp',
      programmingConcept: 'Status Code Verification',
      codeSnippet: 'if response.status_code == 200:',
      highlightLineNumbers: [10],
      storyNote: 'Ensures the tower answered successfully before opening the data envelope.',
      technicalNote: 'Verifies standard HTTP 2xx success response.'
    },
    {
      id: 'req-map-3',
      storyAction: 'Opening the JSON envelope into Python dict',
      programmingConcept: 'JSON Parsing (.json())',
      codeSnippet: 'weather_data = response.json()',
      highlightLineNumbers: [11],
      storyNote: 'Translates the raw server text string into an easy Python dictionary.',
      technicalNote: 'Parses JSON payload string into native Python dictionaries and lists.'
    }
  ],

  scenes: [
    {
      id: 'req-s1',
      sceneNumber: 1,
      type: 'problem',
      title: 'Ground Control Silence',
      subtitle: 'Clara needs live weather data from 50 miles away.',
      storyText: 'Rain taps against the cockpit windshield. Clara must decide whether runway 24 is safe for takeoff. The weather station is miles away on a distant mountaintop. How can her onboard flight computer get live radar data instantly?',
      technicalText: 'Modern apps need to interact with distributed cloud services over HTTP protocols without manual human intervention.',
      characterFocusId: 'clara',
      dialogue: [
        {
          characterId: 'clara',
          speech: 'I need real-time data from the remote weather server right now!',
          mood: 'worried'
        }
      ]
    },
    {
      id: 'req-s2',
      sceneNumber: 2,
      type: 'characters',
      title: 'The Client and The Server',
      subtitle: 'The fundamental two-way conversation of the web.',
      storyText: 'Clara is the Client (the requester). The Tower is the Server (the responder). The internet cable between them is HTTP.',
      technicalText: 'Client-Server Architecture: The client issues an HTTP request, and the server computes and returns an HTTP response.',
      dialogue: [
        {
          characterId: 'weather-tower',
          speech: 'I am always listening at my API endpoint. Send me a GET request and I will reply with JSON.',
          mood: 'explaining'
        }
      ]
    },
    {
      id: 'req-s3',
      sceneNumber: 3,
      type: 'conflict',
      title: 'The Conflict: Hardcoding vs Live APIs',
      subtitle: 'Why static data fails in a dynamic world.',
      storyText: 'If Clara hardcodes `wind_speed = 10` in her code, yesterday\'s breeze might be today\'s hurricane! Without live network APIs, programs live in total isolation.',
      technicalText: 'Dynamic runtime state vs static compilation: APIs enable access to live external data feeds and multi-tenant services.',
      decision: {
        prompt: 'How should Clara obtain the weather forecast?',
        options: [
          {
            id: 'req-opt-static',
            label: 'Hardcode "sunny" into the Python file and hope for the best',
            isOptimal: false,
            reactionText: 'The plane took off into an unexpected hail storm! Hardcoded data was 24 hours out of date.',
            characterReaction: '👩‍✈️ Clara: "Hardcoding live conditions is dangerous!"'
          },
          {
            id: 'req-opt-api',
            label: 'Send requests.get() to the SkyRadar REST API endpoint',
            isOptimal: true,
            reactionText: '200 OK received! Live radar shows storm clouds moved East; runway 24 is 100% clear for takeoff.',
            characterReaction: '📡 Tower: "Telemetry delivered successfully in 120ms."'
          }
        ]
      }
    },
    {
      id: 'req-s4',
      sceneNumber: 4,
      type: 'discovery',
      title: 'The Discovery: The Requests Library',
      subtitle: 'HTTP for Humans in Python.',
      storyText: 'The `requests` library is famous for its motto: "HTTP for Humans". With a single line `requests.get(url)`, it manages SSL certificates, network handshakes, and header negotiation automatically.',
      technicalText: 'Requests wraps Python\'s standard `urllib3` with clean session connection pooling, authentication helpers, and JSON decoding.',
      highlightCodeLines: [1, 7]
    },
    {
      id: 'req-s5',
      sceneNumber: 5,
      type: 'solution',
      title: 'The Solution: The 3-Step API Call',
      subtitle: 'Request -> Status Check -> JSON Parse.',
      storyText: '1. Send request: `response = requests.get(url)`\n2. Check status: `if response.status_code == 200:`\n3. Parse data: `data = response.json()`',
      technicalText: 'Standard HTTP consumption cycle with error status handling (200 OK, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error).'
    },
    {
      id: 'req-s6',
      sceneNumber: 6,
      type: 'translation',
      title: 'Technical Translation Layer',
      subtitle: 'Translating radio dispatches into HTTP network methods.',
      storyText: 'Radio channel = Endpoint URL. Handshake = 200 OK. Data envelope = JSON dict.',
      technicalText: 'Inspect HTTP methods (GET, POST, PUT, DELETE) and status code ranges.',
      highlightCodeLines: [4, 7, 10, 11]
    },
    {
      id: 'req-s7',
      sceneNumber: 7,
      type: 'code',
      title: 'The Code Connection',
      subtitle: 'Click to trace the network handshake line by line.',
      storyText: 'Follow how requests dispatches the call and inspects status_code.',
      technicalText: 'Tracing synchronous HTTP execution in Python.',
      highlightCodeLines: [1, 4, 7, 10, 11, 14]
    },
    {
      id: 'req-s8',
      sceneNumber: 8,
      type: 'interactive',
      title: 'Live SkyRadar API Sandbox',
      subtitle: 'Simulate airport API queries with live latency and status responses!',
      storyText: 'Select different airport codes or simulate server error codes to see how the Python client reacts.',
      technicalText: 'Simulate REST API client queries, parameter serialization, and JSON decoding.',
      highlightCodeLines: [7, 10, 11]
    },
    {
      id: 'req-s9',
      sceneNumber: 9,
      type: 'result',
      title: 'Clear for Takeoff',
      subtitle: 'Real-time accuracy saves the flight.',
      storyText: 'Clara throttles up the engines. Runway 24 is smooth, dry, and wind conditions are verified in real time.',
      technicalText: 'Successfully integrated external REST API with sub-200ms latency and robust error handling.',
      characterFocusId: 'clara',
      dialogue: [
        {
          characterId: 'clara',
          speech: 'Connected to the world in 3 lines of code. Now we can fly anywhere safely!',
          mood: 'triumphant'
        }
      ]
    },
    {
      id: 'req-s10',
      sceneNumber: 10,
      type: 'recap',
      title: 'Lesson Recap',
      subtitle: 'The Web API mental model.',
      storyText: 'Remember: Request to URL -> verify 200 status -> extract .json().',
      technicalText: 'Review HTTP verbs, REST endpoints, and status code best practices.'
    },
    {
      id: 'req-s11',
      sceneNumber: 11,
      type: 'challenge',
      title: 'Mini Challenge',
      subtitle: 'Test your API knowledge.',
      storyText: 'Help a developer handle a missing web resource!',
      technicalText: 'Test understanding of HTTP status codes and error branches.'
    }
  ],

  interactiveSimulator: {
    title: 'SkyRadar Live Weather API Simulator',
    description: 'Send live simulated GET requests to airport endpoints and inspect returned JSON payloads.',
    sampleDatasetName: 'skyradar_api_endpoints',
    columns: [
      { key: 'airport_code', label: 'Airport', type: 'string' },
      { key: 'city', label: 'City', type: 'string' },
      { key: 'status_code', label: 'Status', type: 'badge' },
      { key: 'wind_speed_kts', label: 'Wind (kts)', type: 'number' },
      { key: 'visibility_mi', label: 'Visibility (mi)', type: 'number' },
      { key: 'takeoff_approved', label: 'Flight Status', type: 'badge' }
    ],
    initialData: [
      { id: 1, airport_code: 'SEA', city: 'Seattle', status_code: '200 OK', wind_speed_kts: 12, visibility_mi: 10, takeoff_approved: 'Cleared ✈️' },
      { id: 2, airport_code: 'SFO', city: 'San Francisco', status_code: '200 OK', wind_speed_kts: 18, visibility_mi: 8, takeoff_approved: 'Cleared ✈️' },
      { id: 3, airport_code: 'ORD', city: 'Chicago', status_code: '200 OK', wind_speed_kts: 28, visibility_mi: 3, takeoff_approved: 'Storm Hold ⚠️' },
      { id: 4, airport_code: 'JFK', city: 'New York', status_code: '200 OK', wind_speed_kts: 9, visibility_mi: 12, takeoff_approved: 'Cleared ✈️' },
      { id: 5, airport_code: 'XXX', city: 'Unknown Station', status_code: '404 Not Found', wind_speed_kts: 0, visibility_mi: 0, takeoff_approved: 'Error ❌' }
    ],
    controls: [
      {
        id: 'selectedAirport',
        label: 'Target Airport Code',
        type: 'select',
        defaultValue: 'SEA',
        options: [
          { label: 'SEA (Seattle - Normal)', value: 'SEA' },
          { label: 'SFO (San Francisco - Normal)', value: 'SFO' },
          { label: 'ORD (Chicago - High Winds)', value: 'ORD' },
          { label: 'JFK (New York - Clear)', value: 'JFK' },
          { label: 'XXX (Invalid Code - 404 Test)', value: 'XXX' }
        ]
      }
    ],
    pythonCodeTemplate: (params) => {
      return `import requests

url = f"https://api.skyradar.com/v1/airports/${params.selectedAirport}"
response = requests.get(url)

if response.status_code == 200:
    data = response.json()
    print("✅ Airport Report Received:")
    print(f"City: {data['city']}")
    print(f"Wind: {data['wind_speed_kts']} kts")
    print(f"Flight Status: {data['takeoff_approved']}")
else:
    print(f"❌ Failed to reach airport: HTTP {response.status_code}")`;
    },
    simulationLogic: (params, rawData) => {
      const match = rawData.find(r => r.airport_code === params.selectedAirport) || rawData[0];
      const isSuccess = match.status_code === '200 OK';

      return {
        filteredData: [match],
        computedStats: [
          { label: 'HTTP Status', value: match.status_code },
          { label: 'Network Latency', value: isSuccess ? '118 ms' : '45 ms' },
          { label: 'Payload Format', value: isSuccess ? 'application/json' : 'text/plain' },
          { label: 'Flight Clearance', value: match.takeoff_approved }
        ],
        executionTimeMs: 0.118,
        logMessages: [
          `[DNS Resolver] Resolved api.skyradar.com -> 172.217.16.206`,
          `[TLS Handshake] Established secure TLS 1.3 session in 42ms`,
          `[HTTP GET] GET /v1/airports/${params.selectedAirport} -> ${match.status_code}`,
          isSuccess 
            ? `[JSON Decoder] Parsed 6 keys into Python dictionary` 
            : `[Error Handler] Received client error status code 404`
        ]
      };
    }
  },

  challenge: {
    question: 'A weather API returns status code 404 when you query `/airport/XYZ`. What does this mean and how should your code respond?',
    scenarioContext: 'Scenario: Handling non-200 HTTP responses in Python scripts.',
    options: [
      {
        id: 'opt-api-q1',
        text: 'The server crashed with a fatal database bug; restart your computer.',
        isCorrect: false,
        explanation: 'Status 500 represents internal server errors, not 404. 404 is a client-side "Not Found" error indicating the airport XYZ does not exist.'
      },
      {
        id: 'opt-api-q2',
        text: 'Status 404 means "Not Found" — the requested airport ID does not exist on the server. Your code should check `response.status_code == 200` before calling `.json()`.',
        isCorrect: true,
        explanation: 'Spot on! 404 means the endpoint resource was not found. Always check `if response.status_code == 200:` to prevent JSON decoding errors on invalid responses.'
      },
      {
        id: 'opt-api-q3',
        text: 'It means the network cable is unplugged.',
        isCorrect: false,
        explanation: 'If the network cable were unplugged, requests would raise a `ConnectionError` exception instead of receiving a 404 response from the server.'
      }
    ],
    conceptualTakeaway: 'Always check `response.status_code == 200` or use `response.raise_for_status()` to gracefully handle missing resources.'
  },

  recapSummary: {
    problem: 'Programs need real-time data from external remote servers over the web.',
    concept: 'Requests & Web APIs (`requests.get(url)`).',
    whyNeeded: 'Connects code to live global services (weather, stock markets, payments, AI).',
    howItWorks: 'Dispatches HTTP requests, receives status codes (200 OK), and decodes JSON responses into Python dictionaries.',
    keySyntax: "import requests\nresp = requests.get('https://api.site.com')\nif resp.status_code == 200:\n    data = resp.json()",
    keyResult: 'Retrieved live flight weather from 50 miles away in 118 milliseconds.'
  }
};

export const NUMPY_LESSON: Lesson = {
  id: 'numpy-matrix-architect',
  slug: 'numpy-matrix-architect',
  title: 'The Satellite Architect & High-Speed Vectors',
  tagline: 'Why nested loops take 45 seconds while NumPy matrix broadcasting computes in 0.001 seconds.',
  topic: 'NumPy & Vectorization',
  category: 'Data Science',
  difficulty: 'Intermediate',
  estimatedMinutes: 8,
  icon: 'Cpu',
  
  jobRole: {
    title: 'Data Scientist / ML Engineer',
    industry: 'Earth Observation & Artificial Intelligence',
    realWorldUse: 'Processes multi-gigabyte numerical sensor arrays, images, and neural network weights.',
    typicalDailyTasks: [
      'Normalizing satellite pixel brightness across spectral bands',
      'Computing matrix dot-products for machine learning embeddings',
      'Running lightning-fast mathematical transformations over 3D arrays'
    ]
  },

  realWorldProblem: {
    headline: 'Processing 10 Million Satellite Pixels in Orbit',
    description: 'Dr. Aris is processing infrared satellite imagery of wildfires. Each satellite image has 10,000,000 pixel values. Dr. Aris needs to multiply all pixels by a calibration factor of 1.45. Running a traditional nested Python list loop takes 45 seconds per frame. The wildfire moves faster than his code can process!',
    scaleMetric: '10,000,000 floating-point pixel calculations per satellite frame',
    failureOfManualWork: 'Standard Python lists store heap pointers and type metadata for each individual number, making nested loops 50x to 100x slower than compiled hardware operations.'
  },

  characters: [
    {
      id: 'aris',
      name: 'Dr. Aris',
      role: 'Satellite Scientist',
      represents: 'The AI / Data Scientist',
      whatTheyNeedToAccomplish: 'Calibrate millions of sensor pixels in real time without lag.',
      avatarEmoji: '👨‍🔬',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      quote: 'The forest fire is spreading! I cannot wait 45 seconds for a Python loop to finish!'
    },
    {
      id: 'numpy-core',
      name: 'NumPy',
      role: 'Vector Architect',
      represents: 'Numerical Python (C-compiled ndarrays)',
      whatTheyNeedToAccomplish: 'Store raw numbers contiguously in RAM and compute across all elements in parallel SIMD instructions.',
      avatarEmoji: '⚡',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      quote: 'Hand me that matrix! I do not do one-by-one loops. I broadcast math across 10,000,000 numbers in 1 single CPU cycle.'
    }
  ],

  technicalTranslations: [
    {
      storyCharacter: 'Dr. Aris',
      technicalConcept: 'Scientific Programmer',
      storyExplanation: 'The researcher defining math formulas and vector operations.',
      technicalExplanation: 'The author constructing tensor pipelines and array manipulations.',
      codeSnippet: 'import numpy as np'
    },
    {
      storyCharacter: 'The Satellite Pixel Grid',
      technicalConcept: 'NumPy ndarray (N-Dimensional Array)',
      storyExplanation: 'A rigid grid of raw numbers stored side-by-side in computer memory.',
      technicalExplanation: 'A contiguous C-order buffer of homogeneous numeric data types (e.g. float64).',
      codeSnippet: "pixels = np.array([120.5, 88.2, 240.1, 15.0])"
    },
    {
      storyCharacter: 'The Lightning Multiplier',
      technicalConcept: 'Vectorized Broadcasting',
      storyExplanation: 'Multiplying the whole grid by 1.45 in one breath without loops.',
      technicalExplanation: 'Applying arithmetic operations across the entire buffer using SIMD CPU instructions.',
      codeSnippet: 'calibrated = pixels * 1.45'
    }
  ],

  fullPythonCode: `import numpy as np

# 1. Create a 1D/2D array of raw satellite sensor readings
pixels = np.array([45.2, 89.1, 130.4, 210.8, 95.0, 18.3], dtype=np.float32)

# 2. Vectorized Broadcasting (Zero manual loops!)
calibration_factor = 1.45
calibrated_pixels = pixels * calibration_factor

# 3. Fast Vectorized Reductions
mean_heat = np.mean(calibrated_pixels)
max_temp = np.max(calibrated_pixels)

print(f"🔥 Max Temperature: {max_temp:.1f}°C | Average Heat: {mean_heat:.1f}°C")
print(f"⚡ 10M elements processed in 0.001s using vectorized C-routines!")
`,

  storyToCodeMappings: [
    {
      id: 'num-map-1',
      storyAction: 'Importing the Vector Architect',
      programmingConcept: 'NumPy Import Alias',
      codeSnippet: 'import numpy as np',
      highlightLineNumbers: [1],
      storyNote: 'Brings NumPy into the workspace with the universal alias "np".',
      technicalNote: 'Imports compiled C-extensions for hardware-accelerated numeric tensors.'
    },
    {
      id: 'num-map-2',
      storyAction: 'Packing numbers into a contiguous memory grid',
      programmingConcept: 'ndarray Creation',
      codeSnippet: 'pixels = np.array([45.2, 89.1, ...], dtype=np.float32)',
      highlightLineNumbers: [4],
      storyNote: 'Stores all raw numbers in direct hardware memory side-by-side.',
      technicalNote: 'Allocates a single continuous block of bytes with fixed itemsize.'
    },
    {
      id: 'num-map-3',
      storyAction: 'Multiplying all numbers simultaneously',
      programmingConcept: 'Vectorized Broadcasting',
      codeSnippet: 'calibrated_pixels = pixels * calibration_factor',
      highlightLineNumbers: [8],
      storyNote: 'No loop required! The multiplier applies to every single number instantly.',
      technicalNote: 'Executes parallel SIMD (Single Instruction, Multiple Data) processor instructions.'
    }
  ],

  scenes: [
    {
      id: 'num-s1',
      sceneNumber: 1,
      type: 'problem',
      title: 'The Satellite Telemetry Bottleneck',
      subtitle: '10,000,000 infrared sensor readings arriving per second.',
      storyText: 'Wildfire sensor satellite "Ignis-4" streams 10 million heat values per frame. Dr. Aris needs to calibrate every value against atmospheric distortion. When he uses a standard Python `for` loop, his CPU maxes out, takes 45 seconds per frame, and falls hopelessly behind real time.',
      technicalText: 'Standard Python lists incur pointer-chasing overhead and type-checking on every item iteration, causing 50x-100x performance penalties for numeric arrays.',
      characterFocusId: 'aris',
      dialogue: [
        {
          characterId: 'aris',
          speech: 'I need to calibrate 10 million pixels instantly, but my Python for-loop takes 45 seconds!',
          mood: 'worried'
        }
      ]
    },
    {
      id: 'num-s2',
      sceneNumber: 2,
      type: 'characters',
      title: 'Meet the Vector Architect',
      subtitle: 'Why NumPy is the foundation of all AI and Data Science.',
      storyText: 'NumPy ("Numerical Python") was created in 2006 by Travis Oliphant to solve this exact problem. It strips away all Python overhead and stores pure numbers in contiguous C-memory blocks.',
      technicalText: 'The `ndarray` is a multidimensional container of homogeneous items, accessed via optimized BLAS/LAPACK linear algebra subroutines.',
      dialogue: [
        {
          characterId: 'numpy-core',
          speech: 'Forget slow Python loops! When you multiply a NumPy array, your CPU calculates 8 numbers at the same time in hardware.',
          mood: 'triumphant'
        }
      ]
    },
    {
      id: 'num-s3',
      sceneNumber: 3,
      type: 'conflict',
      title: 'The Conflict: Python List vs NumPy Array',
      subtitle: 'Scattered memory pointers vs Contiguous Hardware Buffers.',
      storyText: 'In a standard Python list, each number is a heavy Python object floating in separate memory locations. In a NumPy array, all numbers sit side-by-side like soldiers in a marching band.',
      technicalText: 'Memory locality: C-contiguous array layout enables CPU cache pre-fetching and eliminates dynamic type dispatch.',
      decision: {
        prompt: 'How should Dr. Aris calibrate the 10 million pixels?',
        options: [
          {
            id: 'num-opt-loop',
            label: 'Run a nested `for row in grid: for pixel in row:` loop',
            isOptimal: false,
            reactionText: 'Loop took 46.2 seconds! The satellite image arrived late and the fire boundary was missed.',
            characterReaction: '👨‍🔬 Dr. Aris: "46 seconds is way too slow for real-time wildfire tracking!"'
          },
          {
            id: 'num-opt-numpy',
            label: 'Use NumPy Vectorized Broadcasting: `pixels * 1.45`',
            isOptimal: true,
            reactionText: 'Done in 0.0012 seconds! Over 38,000x faster than the Python loop!',
            characterReaction: '⚡ NumPy: "10,000,000 pixels calibrated in 1.2 milliseconds."'
          }
        ]
      }
    },
    {
      id: 'num-s4',
      sceneNumber: 4,
      type: 'discovery',
      title: 'The Discovery: Broadcasting',
      subtitle: 'Doing math without writing loops.',
      storyText: 'In NumPy, you do not write loops to add 5 or multiply by 2. You simply write `array * 2` or `array1 + array2`. NumPy "broadcasts" the operation across the entire grid at compiled C-speed.',
      technicalText: 'Broadcasting rules describe how NumPy handles arrays with different shapes during arithmetic operations without creating redundant copies.',
      highlightCodeLines: [8]
    },
    {
      id: 'num-s5',
      sceneNumber: 5,
      type: 'solution',
      title: 'The Solution: High-Speed Science',
      subtitle: 'The 3 Pillars of NumPy: Array, Vectorize, Aggregate.',
      storyText: '1. `np.array([...])`: Create fast memory array\n2. `array * factor`: Vectorized element-wise math\n3. `np.mean()`, `np.max()`: Instant multi-million element reductions',
      technicalText: 'Vectorized pipelines form the backbone of modern machine learning frameworks including PyTorch, TensorFlow, and Scikit-Learn.'
    },
    {
      id: 'num-s6',
      sceneNumber: 6,
      type: 'translation',
      title: 'Technical Translation Layer',
      subtitle: 'Translating satellite telemetry into matrix vector operations.',
      storyText: 'Pixel Grid = ndarray. Calibration = Vectorized scalar multiplication. Hotspot finder = np.max().',
      technicalText: 'Inspect the C-memory layout and SIMD instruction mapping.',
      highlightCodeLines: [4, 8, 11, 12]
    },
    {
      id: 'num-s7',
      sceneNumber: 7,
      type: 'code',
      title: 'The Code Connection',
      subtitle: 'Direct line mapping of NumPy array math.',
      storyText: 'Click the steps to trace array creation, vectorized math, and statistical reduction.',
      technicalText: 'Execution flow of C-compiled NumPy routines.',
      highlightCodeLines: [1, 4, 7, 8, 11, 12]
    },
    {
      id: 'num-s8',
      sceneNumber: 8,
      type: 'interactive',
      title: 'Interactive Matrix Sandbox',
      subtitle: 'Adjust calibration factor and see real-time vector math execution in microseconds!',
      storyText: 'Slide the calibration knob or toggle heat filters to see instantaneous array transformation.',
      technicalText: 'Real-time vectorized array manipulation with simulated execution time benchmarks.',
      highlightCodeLines: [8, 11]
    },
    {
      id: 'num-s9',
      sceneNumber: 9,
      type: 'result',
      title: 'Wildfire Detected in Real Time',
      subtitle: '1.2ms processing latency saves the forest.',
      storyText: 'Dr. Aris spots the thermal hotspot in under 2 milliseconds. Emergency crews are dispatched immediately, containing the blaze before it reaches the town.',
      technicalText: 'Achieved real-time streaming throughput exceeding 1 gigabyte per second using NumPy vectorization.',
      characterFocusId: 'aris',
      dialogue: [
        {
          characterId: 'aris',
          speech: 'From 45 seconds down to 1 millisecond. NumPy is the secret engine of modern computing!',
          mood: 'triumphant'
        }
      ]
    },
    {
      id: 'num-s10',
      sceneNumber: 10,
      type: 'recap',
      title: 'Lesson Recap',
      subtitle: 'Key principles of NumPy vectorization.',
      storyText: 'Never write a Python loop over numeric arrays when NumPy broadcasting can do it 100x faster.',
      technicalText: 'Summary of ndarray memory layouts, vectorization benefits, and universal functions (ufuncs).'
    },
    {
      id: 'num-s11',
      sceneNumber: 11,
      type: 'challenge',
      title: 'Mini Challenge',
      subtitle: 'Test your vector intuition.',
      storyText: 'Help Dr. Aris choose the fastest method to convert Fahrenheit to Celsius across 1,000,000 sensor numbers!',
      technicalText: 'Evaluate array vectorization vs iterative scalar computation.'
    }
  ],

  interactiveSimulator: {
    title: 'Satellite Sensor Array Vector Calibration',
    description: 'Experiment with vectorized broadcasting across simulated multi-band satellite pixel arrays.',
    sampleDatasetName: 'ignis4_satellite_telemetry',
    columns: [
      { key: 'pixel_id', label: 'Pixel ID', type: 'string' },
      { key: 'raw_intensity', label: 'Raw Reading', type: 'number' },
      { key: 'calibrated_temp', label: 'Calibrated (°C)', type: 'number' },
      { key: 'risk_level', label: 'Thermal Risk', type: 'badge' }
    ],
    initialData: [
      { id: 1, pixel_id: 'PX-1001', raw_intensity: 45.0, calibrated_temp: 65.2, risk_level: 'Normal' },
      { id: 2, pixel_id: 'PX-1002', raw_intensity: 88.5, calibrated_temp: 128.3, risk_level: 'Elevated' },
      { id: 3, pixel_id: 'PX-1003', raw_intensity: 240.0, calibrated_temp: 348.0, risk_level: '🔥 Wildfire' },
      { id: 4, pixel_id: 'PX-1004', raw_intensity: 15.2, calibrated_temp: 22.0, risk_level: 'Normal' },
      { id: 5, pixel_id: 'PX-1005', raw_intensity: 195.0, calibrated_temp: 282.7, risk_level: '🔥 Wildfire' },
      { id: 6, pixel_id: 'PX-1006', raw_intensity: 62.0, calibrated_temp: 89.9, risk_level: 'Normal' }
    ],
    controls: [
      {
        id: 'factor',
        label: 'Calibration Multiplier',
        type: 'slider',
        min: 1.0,
        max: 2.5,
        step: 0.1,
        defaultValue: 1.45
      }
    ],
    pythonCodeTemplate: (params) => {
      return `import numpy as np

# 10 Million pixel sensor array
raw_pixels = np.array([45.0, 88.5, 240.0, 15.2, 195.0, 62.0])

# Vectorized multiplication (No loops!)
calibration_factor = ${params.factor}
calibrated = raw_pixels * calibration_factor

# Find thermal maximum
max_temp = np.max(calibrated)
mean_temp = np.mean(calibrated)

print(f"Array calibrated in 0.001ms: Max = {max_temp:.1f}°C, Avg = {mean_temp:.1f}°C")`;
    },
    simulationLogic: (params, rawData) => {
      const factor = params.factor || 1.45;
      const updated = rawData.map(r => {
        const cal = Number((r.raw_intensity * factor).toFixed(1));
        let risk = 'Normal';
        if (cal > 200) risk = '🔥 Wildfire';
        else if (cal > 100) risk = 'Elevated';
        return {
          ...r,
          calibrated_temp: cal,
          risk_level: risk
        };
      });

      const maxTemp = Math.max(...updated.map(r => r.calibrated_temp));
      const avgTemp = (updated.reduce((a, b) => a + b.calibrated_temp, 0) / updated.length).toFixed(1);

      return {
        filteredData: updated,
        computedStats: [
          { label: 'Array Size', value: '10,000,000 elements' },
          { label: 'Execution Speedup', value: '38,400x vs Python Loop' },
          { label: 'Max Temperature', value: `${maxTemp}°C` },
          { label: 'Average Heat', value: `${avgTemp}°C` }
        ],
        executionTimeMs: 0.0012,
        logMessages: [
          `[NumPy Memory] Allocated 40MB contiguous buffer (dtype=float32)`,
          `[SIMD Instruction] Applied vector scalar multiplication (* ${factor}) across buffer`,
          `[Fast Reduction] np.max() & np.mean() calculated in 1 pass`
        ]
      };
    }
  },

  challenge: {
    question: 'You have a NumPy array of 1,000,000 Fahrenheit temperatures: `f_temps = np.array([...])`. What is the most idiomatic and fastest way to convert all temperatures to Celsius `(F - 32) * 5/9`?',
    scenarioContext: 'Scenario: Converting 1,000,000 temperatures using NumPy vectorization.',
    options: [
      {
        id: 'opt-np-q1',
        text: '`c_temps = (f_temps - 32) * (5/9)` (Direct vectorized math)',
        isCorrect: true,
        explanation: 'Perfect! NumPy applies subtraction and multiplication across all 1,000,000 elements in parallel using vectorized SIMD CPU instructions without any manual loops.'
      },
      {
        id: 'opt-np-q2',
        text: '`c_temps = [((t - 32) * 5/9) for t in f_temps]` (List comprehension)',
        isCorrect: false,
        explanation: 'A list comprehension loops in Python bytecode, converting fast NumPy numbers back into slow Python objects and running 40x slower!'
      },
      {
        id: 'opt-np-q3',
        text: 'Create a while loop with an index counter checking `i < len(f_temps)`.',
        isCorrect: false,
        explanation: 'A manual while loop is the slowest possible approach in Python and completely misses the purpose of using NumPy.'
      }
    ],
    conceptualTakeaway: 'Always write mathematical formulas directly on the NumPy array — NumPy will broadcast the math across all elements instantly.'
  },

  recapSummary: {
    problem: 'Processing millions of numbers with standard Python loops takes 45+ seconds.',
    concept: 'NumPy & Vectorized Arrays (`np.ndarray`).',
    whyNeeded: 'Hardware-accelerated C routines execute math across entire memory buffers in parallel.',
    howItWorks: 'Stores homogeneous numbers contiguously in memory; operations broadcast without manual loops.',
    keySyntax: "import numpy as np\narr = np.array([10, 20, 30])\nresult = arr * 1.5",
    keyResult: 'Processed 10,000,000 pixel readings in 1.2 milliseconds.'
  }
};

export const ALL_LESSONS: Lesson[] = [
  ...[/* imported dynamically or combined */],
  REQUESTS_API_LESSON,
  NUMPY_LESSON
];
