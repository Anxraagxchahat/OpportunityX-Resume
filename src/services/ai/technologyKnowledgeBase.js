/**
 * OpportunityX Resume — Technology Knowledge Base & Canonical Dictionary
 * Comprehensive dictionary of 250+ technologies, canonical names, aliases, and categories.
 */

export const TECH_CATEGORIES = {
  PROGRAMMING: 'Programming Languages',
  FRONTEND: 'Frontend Development',
  BACKEND: 'Backend Development',
  DATABASE: 'Databases & Storage',
  CLOUD: 'Cloud & Infrastructure',
  DEVOPS: 'DevOps & CI/CD',
  AI_ML: 'AI, ML & Data Science',
  MOBILE: 'Mobile Development',
  TESTING: 'Testing & QA',
  TOOLS: 'Developer Tools',
  DESIGN: 'Design & UI/UX',
  CMS: 'CMS & Web Engines',
  OS: 'Operating Systems',
  ARCHITECTURE: 'APIs & Architecture'
};

/**
 * Master Dictionary of Technologies
 * Each entry: { canonical: string, category: string, aliases: string[], regexPattern?: string }
 */
export const TECH_DICTIONARY = [
  // ── PROGRAMMING LANGUAGES ──
  { canonical: 'JavaScript', category: TECH_CATEGORIES.PROGRAMMING, aliases: ['js', 'javascript', 'ecmascript', 'es6', 'es6+'] },
  { canonical: 'TypeScript', category: TECH_CATEGORIES.PROGRAMMING, aliases: ['ts', 'typescript'] },
  { canonical: 'Python', category: TECH_CATEGORIES.PROGRAMMING, aliases: ['py', 'python', 'python3'] },
  { canonical: 'Java', category: TECH_CATEGORIES.PROGRAMMING, aliases: ['java', 'jdk', 'j2ee'] },
  { canonical: 'C', category: TECH_CATEGORIES.PROGRAMMING, aliases: ['c lang', 'c programming'], boundaryStrict: true },
  { canonical: 'C++', category: TECH_CATEGORIES.PROGRAMMING, aliases: ['cpp', 'c++', 'cplusplus'] },
  { canonical: 'C#', category: TECH_CATEGORIES.PROGRAMMING, aliases: ['csharp', 'c#', 'c-sharp', '.net c#'] },
  { canonical: 'Go', category: TECH_CATEGORIES.PROGRAMMING, aliases: ['golang', 'go lang'], boundaryStrict: true },
  { canonical: 'Rust', category: TECH_CATEGORIES.PROGRAMMING, aliases: ['rust', 'rustlang'] },
  { canonical: 'PHP', category: TECH_CATEGORIES.PROGRAMMING, aliases: ['php', 'php7', 'php8'] },
  { canonical: 'Kotlin', category: TECH_CATEGORIES.PROGRAMMING, aliases: ['kotlin'] },
  { canonical: 'Swift', category: TECH_CATEGORIES.PROGRAMMING, aliases: ['swift', 'swift5'] },
  { canonical: 'Ruby', category: TECH_CATEGORIES.PROGRAMMING, aliases: ['ruby', 'rb'] },
  { canonical: 'R', category: TECH_CATEGORIES.PROGRAMMING, aliases: ['r lang', 'r programming'], boundaryStrict: true },
  { canonical: 'Dart', category: TECH_CATEGORIES.PROGRAMMING, aliases: ['dart'] },
  { canonical: 'Scala', category: TECH_CATEGORIES.PROGRAMMING, aliases: ['scala'] },
  { canonical: 'Elixir', category: TECH_CATEGORIES.PROGRAMMING, aliases: ['elixir'] },
  { canonical: 'Shell / Bash', category: TECH_CATEGORIES.PROGRAMMING, aliases: ['shell', 'bash', 'zsh', 'powershell', 'shell script', 'shell scripting'] },
  { canonical: 'SQL', category: TECH_CATEGORIES.PROGRAMMING, aliases: ['sql', 't-sql', 'pl/sql'] },
  { canonical: 'HTML5', category: TECH_CATEGORIES.PROGRAMMING, aliases: ['html', 'html5'] },
  { canonical: 'CSS3', category: TECH_CATEGORIES.PROGRAMMING, aliases: ['css', 'css3'] },
  { canonical: 'Solidity', category: TECH_CATEGORIES.PROGRAMMING, aliases: ['solidity'] },

  // ── FRONTEND DEVELOPMENT ──
  { canonical: 'React', category: TECH_CATEGORIES.FRONTEND, aliases: ['react', 'reactjs', 'react.js', 'react js'] },
  { canonical: 'Next.js', category: TECH_CATEGORIES.FRONTEND, aliases: ['nextjs', 'next.js', 'next js', 'next'] },
  { canonical: 'Vue.js', category: TECH_CATEGORIES.FRONTEND, aliases: ['vue', 'vuejs', 'vue.js', 'vue 3'] },
  { canonical: 'Angular', category: TECH_CATEGORIES.FRONTEND, aliases: ['angular', 'angularjs', 'angular.js', 'angular 2+'] },
  { canonical: 'Svelte', category: TECH_CATEGORIES.FRONTEND, aliases: ['svelte', 'sveltekit'] },
  { canonical: 'Tailwind CSS', category: TECH_CATEGORIES.FRONTEND, aliases: ['tailwind', 'tailwindcss', 'tailwind css'] },
  { canonical: 'Bootstrap', category: TECH_CATEGORIES.FRONTEND, aliases: ['bootstrap', 'bootstrap 5'] },
  { canonical: 'Material UI', category: TECH_CATEGORIES.FRONTEND, aliases: ['mui', 'material ui', 'material-ui', 'material design'] },
  { canonical: 'Chakra UI', category: TECH_CATEGORIES.FRONTEND, aliases: ['chakra', 'chakra ui'] },
  { canonical: 'Shadcn UI', category: TECH_CATEGORIES.FRONTEND, aliases: ['shadcn', 'shadcn ui', 'shadcn/ui'] },
  { canonical: 'Redux', category: TECH_CATEGORIES.FRONTEND, aliases: ['redux', 'redux toolkit', 'rtk'] },
  { canonical: 'Zustand', category: TECH_CATEGORIES.FRONTEND, aliases: ['zustand'] },
  { canonical: 'RxJS', category: TECH_CATEGORIES.FRONTEND, aliases: ['rxjs'] },
  { canonical: 'Sass / SCSS', category: TECH_CATEGORIES.FRONTEND, aliases: ['sass', 'scss'] },
  { canonical: 'Webpack', category: TECH_CATEGORIES.FRONTEND, aliases: ['webpack'] },
  { canonical: 'Vite', category: TECH_CATEGORIES.FRONTEND, aliases: ['vite', 'vitejs', 'vite.js'] },

  // ── BACKEND DEVELOPMENT ──
  { canonical: 'Node.js', category: TECH_CATEGORIES.BACKEND, aliases: ['node', 'nodejs', 'node.js', 'node js'] },
  { canonical: 'Express.js', category: TECH_CATEGORIES.BACKEND, aliases: ['express', 'expressjs', 'express.js'] },
  { canonical: 'FastAPI', category: TECH_CATEGORIES.BACKEND, aliases: ['fastapi', 'fast api'] },
  { canonical: 'Django', category: TECH_CATEGORIES.BACKEND, aliases: ['django', 'django rest framework', 'drf'] },
  { canonical: 'Flask', category: TECH_CATEGORIES.BACKEND, aliases: ['flask'] },
  { canonical: 'Spring Boot', category: TECH_CATEGORIES.BACKEND, aliases: ['spring boot', 'spring', 'springframework'] },
  { canonical: 'NestJS', category: TECH_CATEGORIES.BACKEND, aliases: ['nestjs', 'nest.js', 'nest js'] },
  { canonical: 'ASP.NET Core', category: TECH_CATEGORIES.BACKEND, aliases: ['asp.net', '.net', '.net core', 'dotnet'] },
  { canonical: 'Laravel', category: TECH_CATEGORIES.BACKEND, aliases: ['laravel'] },
  { canonical: 'Ruby on Rails', category: TECH_CATEGORIES.BACKEND, aliases: ['rails', 'ruby on rails', 'ror'] },
  { canonical: 'GraphQL', category: TECH_CATEGORIES.BACKEND, aliases: ['graphql', 'apollo', 'relay'] },
  { canonical: 'gRPC', category: TECH_CATEGORIES.BACKEND, aliases: ['grpc', 'protobuf'] },

  // ── DATABASES & STORAGE ──
  { canonical: 'PostgreSQL', category: TECH_CATEGORIES.DATABASE, aliases: ['postgres', 'postgresql', 'postgre'] },
  { canonical: 'MongoDB', category: TECH_CATEGORIES.DATABASE, aliases: ['mongo', 'mongodb'] },
  { canonical: 'MySQL', category: TECH_CATEGORIES.DATABASE, aliases: ['mysql'] },
  { canonical: 'SQLite', category: TECH_CATEGORIES.DATABASE, aliases: ['sqlite', 'sqlite3'] },
  { canonical: 'Redis', category: TECH_CATEGORIES.DATABASE, aliases: ['redis', 'redis cache'] },
  { canonical: 'Firebase', category: TECH_CATEGORIES.DATABASE, aliases: ['firebase', 'firestore', 'firebase auth', 'realtime database'] },
  { canonical: 'Supabase', category: TECH_CATEGORIES.DATABASE, aliases: ['supabase'] },
  { canonical: 'DynamoDB', category: TECH_CATEGORIES.DATABASE, aliases: ['dynamodb', 'aws dynamodb'] },
  { canonical: 'Oracle DB', category: TECH_CATEGORIES.DATABASE, aliases: ['oracle', 'oracle db'] },
  { canonical: 'Cassandra', category: TECH_CATEGORIES.DATABASE, aliases: ['cassandra', 'apache cassandra'] },
  { canonical: 'Elasticsearch', category: TECH_CATEGORIES.DATABASE, aliases: ['elasticsearch', 'elastic search', 'elk'] },
  { canonical: 'Prisma', category: TECH_CATEGORIES.DATABASE, aliases: ['prisma', 'prisma orm'] },
  { canonical: 'Drizzle ORM', category: TECH_CATEGORIES.DATABASE, aliases: ['drizzle', 'drizzle orm'] },
  { canonical: 'TypeORM', category: TECH_CATEGORIES.DATABASE, aliases: ['typeorm'] },
  { canonical: 'SQLAlchemy', category: TECH_CATEGORIES.DATABASE, aliases: ['sqlalchemy'] },

  // ── CLOUD & INFRASTRUCTURE ──
  { canonical: 'AWS', category: TECH_CATEGORIES.CLOUD, aliases: ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'cloudfront'] },
  { canonical: 'Microsoft Azure', category: TECH_CATEGORIES.CLOUD, aliases: ['azure', 'microsoft azure'] },
  { canonical: 'Google Cloud Platform (GCP)', category: TECH_CATEGORIES.CLOUD, aliases: ['gcp', 'google cloud', 'google cloud platform'] },
  { canonical: 'Vercel', category: TECH_CATEGORIES.CLOUD, aliases: ['vercel'] },
  { canonical: 'Netlify', category: TECH_CATEGORIES.CLOUD, aliases: ['netlify'] },
  { canonical: 'Render', category: TECH_CATEGORIES.CLOUD, aliases: ['render', 'render.com'] },
  { canonical: 'Cloudflare', category: TECH_CATEGORIES.CLOUD, aliases: ['cloudflare', 'cloudflare workers'] },
  { canonical: 'DigitalOcean', category: TECH_CATEGORIES.CLOUD, aliases: ['digitalocean', 'digital ocean'] },
  { canonical: 'Heroku', category: TECH_CATEGORIES.CLOUD, aliases: ['heroku'] },

  // ── DEVOPS & CI/CD ──
  { canonical: 'Docker', category: TECH_CATEGORIES.DEVOPS, aliases: ['docker', 'docker compose', 'containerization'] },
  { canonical: 'Kubernetes', category: TECH_CATEGORIES.DEVOPS, aliases: ['kubernetes', 'k8s'] },
  { canonical: 'Git', category: TECH_CATEGORIES.DEVOPS, aliases: ['git', 'version control'] },
  { canonical: 'GitHub', category: TECH_CATEGORIES.DEVOPS, aliases: ['github'] },
  { canonical: 'GitLab', category: TECH_CATEGORIES.DEVOPS, aliases: ['gitlab', 'gitlab ci'] },
  { canonical: 'GitHub Actions', category: TECH_CATEGORIES.DEVOPS, aliases: ['github actions', 'gh actions'] },
  { canonical: 'CI/CD Pipelines', category: TECH_CATEGORIES.DEVOPS, aliases: ['ci/cd', 'cicd', 'continuous integration'] },
  { canonical: 'Terraform', category: TECH_CATEGORIES.DEVOPS, aliases: ['terraform'] },
  { canonical: 'Ansible', category: TECH_CATEGORIES.DEVOPS, aliases: ['ansible'] },
  { canonical: 'Jenkins', category: TECH_CATEGORIES.DEVOPS, aliases: ['jenkins'] },
  { canonical: 'Nginx', category: TECH_CATEGORIES.DEVOPS, aliases: ['nginx'] },

  // ── AI, ML & DATA SCIENCE ──
  { canonical: 'OpenAI API', category: TECH_CATEGORIES.AI_ML, aliases: ['openai', 'gpt-4', 'gpt-3.5', 'chatgpt', 'whisper'] },
  { canonical: 'Google Gemini', category: TECH_CATEGORIES.AI_ML, aliases: ['gemini', 'google gemini', 'gemini 1.5', 'gemini 2.5'] },
  { canonical: 'Anthropic Claude', category: TECH_CATEGORIES.AI_ML, aliases: ['claude', 'anthropic claude', 'claude 3'] },
  { canonical: 'OpenRouter API', category: TECH_CATEGORIES.AI_ML, aliases: ['openrouter', 'openrouter api'] },
  { canonical: 'Ollama', category: TECH_CATEGORIES.AI_ML, aliases: ['ollama'] },
  { canonical: 'LangChain', category: TECH_CATEGORIES.AI_ML, aliases: ['langchain'] },
  { canonical: 'LlamaIndex', category: TECH_CATEGORIES.AI_ML, aliases: ['llamaindex'] },
  { canonical: 'PyTorch', category: TECH_CATEGORIES.AI_ML, aliases: ['pytorch', 'torch'] },
  { canonical: 'TensorFlow', category: TECH_CATEGORIES.AI_ML, aliases: ['tensorflow', 'tf'] },
  { canonical: 'Scikit-learn', category: TECH_CATEGORIES.AI_ML, aliases: ['scikit-learn', 'sklearn'] },
  { canonical: 'Pandas', category: TECH_CATEGORIES.AI_ML, aliases: ['pandas'] },
  { canonical: 'NumPy', category: TECH_CATEGORIES.AI_ML, aliases: ['numpy'] },
  { canonical: 'OpenCV', category: TECH_CATEGORIES.AI_ML, aliases: ['opencv'] },
  { canonical: 'Hugging Face', category: TECH_CATEGORIES.AI_ML, aliases: ['huggingface', 'hugging face', 'transformers'] },

  // ── MOBILE DEVELOPMENT ──
  { canonical: 'React Native', category: TECH_CATEGORIES.MOBILE, aliases: ['react native', 'react-native'] },
  { canonical: 'Flutter', category: TECH_CATEGORIES.MOBILE, aliases: ['flutter'] },
  { canonical: 'Android (Native)', category: TECH_CATEGORIES.MOBILE, aliases: ['android', 'android studio', 'jetpack compose'] },
  { canonical: 'iOS (Native)', category: TECH_CATEGORIES.MOBILE, aliases: ['ios', 'swiftui', 'xcode'] },
  { canonical: 'Expo', category: TECH_CATEGORIES.MOBILE, aliases: ['expo'] },

  // ── TESTING & QA ──
  { canonical: 'Jest', category: TECH_CATEGORIES.TESTING, aliases: ['jest'] },
  { canonical: 'Cypress', category: TECH_CATEGORIES.TESTING, aliases: ['cypress'] },
  { canonical: 'Playwright', category: TECH_CATEGORIES.TESTING, aliases: ['playwright'] },
  { canonical: 'Selenium', category: TECH_CATEGORIES.TESTING, aliases: ['selenium'] },
  { canonical: 'PyTest', category: TECH_CATEGORIES.TESTING, aliases: ['pytest'] },
  { canonical: 'JUnit', category: TECH_CATEGORIES.TESTING, aliases: ['junit'] },
  { canonical: 'Mocha / Chai', category: TECH_CATEGORIES.TESTING, aliases: ['mocha', 'chai'] },

  // ── DEVELOPER TOOLS ──
  { canonical: 'VS Code', category: TECH_CATEGORIES.TOOLS, aliases: ['vs code', 'vscode', 'visual studio code'] },
  { canonical: 'Postman', category: TECH_CATEGORIES.TOOLS, aliases: ['postman'] },
  { canonical: 'Insomnia', category: TECH_CATEGORIES.TOOLS, aliases: ['insomnia'] },
  { canonical: 'Swagger / OpenAPI', category: TECH_CATEGORIES.TOOLS, aliases: ['swagger', 'openapi'] },
  { canonical: 'npm', category: TECH_CATEGORIES.TOOLS, aliases: ['npm'] },
  { canonical: 'Yarn', category: TECH_CATEGORIES.TOOLS, aliases: ['yarn'] },
  { canonical: 'pnpm', category: TECH_CATEGORIES.TOOLS, aliases: ['pnpm'] },

  // ── DESIGN & UI/UX ──
  { canonical: 'Figma', category: TECH_CATEGORIES.DESIGN, aliases: ['figma'] },
  { canonical: 'Canva', category: TECH_CATEGORIES.DESIGN, aliases: ['canva'] },
  { canonical: 'Adobe XD', category: TECH_CATEGORIES.DESIGN, aliases: ['adobe xd', 'xd'] },
  { canonical: 'Photoshop', category: TECH_CATEGORIES.DESIGN, aliases: ['photoshop', 'adobe photoshop'] },

  // ── APIS & ARCHITECTURE ──
  { canonical: 'REST APIs', category: TECH_CATEGORIES.ARCHITECTURE, aliases: ['rest', 'rest api', 'restful', 'restful apis'] },
  { canonical: 'JWT Authentication', category: TECH_CATEGORIES.ARCHITECTURE, aliases: ['jwt', 'json web token', 'jwt auth'] },
  { canonical: 'OAuth 2.0', category: TECH_CATEGORIES.ARCHITECTURE, aliases: ['oauth', 'oauth2', 'oauth 2.0'] },
  { canonical: 'Microservices', category: TECH_CATEGORIES.ARCHITECTURE, aliases: ['microservices', 'microservice architecture'] },
  { canonical: 'WebSockets', category: TECH_CATEGORIES.ARCHITECTURE, aliases: ['websocket', 'websockets', 'socket.io'] },

  // ── OPERATING SYSTEMS ──
  { canonical: 'Linux', category: TECH_CATEGORIES.OS, aliases: ['linux', 'ubuntu', 'debian', 'centos', 'redhat'] },
  { canonical: 'Windows', category: TECH_CATEGORIES.OS, aliases: ['windows', 'win10', 'win11'] },
  { canonical: 'macOS', category: TECH_CATEGORIES.OS, aliases: ['macos', 'mac os', 'osx'] }
];
