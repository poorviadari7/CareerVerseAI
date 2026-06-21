export interface Question {
  id: string;
  text: string;
  options: { text: string; trait: string; value: string }[];
  category: string;
}

export const INTERVIEW_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'What subjects do you enjoy the most in school?',
    options: [
      { text: 'Mathematics and Science', trait: 'analytical_thinking', value: 'math_science' },
      { text: 'Literature and Languages', trait: 'communication', value: 'literature' },
      { text: 'Art and Music', trait: 'creativity', value: 'arts' },
      { text: 'History and Social Studies', trait: 'leadership', value: 'social' },
    ],
    category: 'interests',
  },
  {
    id: 'q2',
    text: 'When faced with a difficult problem, what do you usually do?',
    options: [
      { text: 'Break it down into smaller steps', trait: 'analytical_thinking', value: 'breakdown' },
      { text: 'Ask others for help and collaborate', trait: 'teamwork', value: 'collaborate' },
      { text: 'Think of creative alternative solutions', trait: 'creativity', value: 'creative' },
      { text: 'Take charge and lead the solution', trait: 'leadership', value: 'lead' },
    ],
    category: 'problem_solving',
  },
  {
    id: 'q3',
    text: 'What kind of work environment do you prefer?',
    options: [
      { text: 'Quiet, focused, and independent', trait: 'analytical_thinking', value: 'quiet' },
      { text: 'Fast-paced and dynamic', trait: 'adaptability', value: 'dynamic' },
      { text: 'Collaborative and team-oriented', trait: 'teamwork', value: 'team' },
      { text: 'Creative and flexible', trait: 'creativity', value: 'creative_env' },
    ],
    category: 'environment',
  },
  {
    id: 'q4',
    text: 'In a group project, which role do you naturally take?',
    options: [
      { text: 'The researcher who gathers facts', trait: 'analytical_thinking', value: 'researcher' },
      { text: 'The leader who organizes everyone', trait: 'leadership', value: 'leader' },
      { text: 'The presenter who communicates ideas', trait: 'communication', value: 'presenter' },
      { text: 'The designer who makes it look great', trait: 'creativity', value: 'designer' },
    ],
    category: 'teamwork',
  },
  {
    id: 'q5',
    text: 'What excites you most about the future?',
    options: [
      { text: 'Building new technologies', trait: 'analytical_thinking', value: 'tech' },
      { text: 'Helping people and communities', trait: 'communication', value: 'helping' },
      { text: 'Creating art or entertainment', trait: 'creativity', value: 'art' },
      { text: 'Leading organizations and change', trait: 'leadership', value: 'leading' },
    ],
    category: 'aspirations',
  },
  {
    id: 'q6',
    text: 'How do you prefer to learn new things?',
    options: [
      { text: 'Reading and studying theory', trait: 'analytical_thinking', value: 'theory' },
      { text: 'Hands-on practice and experimentation', trait: 'adaptability', value: 'hands_on' },
      { text: 'Discussing and debating with others', trait: 'communication', value: 'discussion' },
      { text: 'Watching videos and visual content', trait: 'creativity', value: 'visual' },
    ],
    category: 'learning',
  },
  {
    id: 'q7',
    text: 'When plans change unexpectedly, how do you react?',
    options: [
      { text: 'Quickly adapt and find a new approach', trait: 'adaptability', value: 'adapt' },
      { text: 'Analyze the situation and make a plan', trait: 'analytical_thinking', value: 'analyze' },
      { text: 'Rally the team and motivate everyone', trait: 'leadership', value: 'rally' },
      { text: 'Communicate clearly to manage expectations', trait: 'communication', value: 'communicate' },
    ],
    category: 'adaptability',
  },
  {
    id: 'q8',
    text: 'What would you do in your free time?',
    options: [
      { text: 'Solve puzzles or coding challenges', trait: 'analytical_thinking', value: 'puzzles' },
      { text: 'Write stories, draw, or make music', trait: 'creativity', value: 'creative_hobby' },
      { text: 'Play team sports or socialize', trait: 'teamwork', value: 'sports' },
      { text: 'Organize events or volunteer', trait: 'leadership', value: 'organize' },
    ],
    category: 'hobbies',
  },
];

export const QUEST_SCENARIOS = [
  {
    id: 'cyberattack',
    title: 'Cyber Crisis Response',
    description: 'A major city experiences a widespread cyberattack. Critical systems are going offline. The emergency response team needs you.',
    questions: [
      {
        text: 'The city\'s power grid is compromised. What is your first move?',
        options: [
          { text: 'Investigate the attack source and trace the breach', trait: 'analytical_thinking' },
          { text: 'Coordinate the emergency response team', trait: 'leadership' },
          { text: 'Design a new defensive system to prevent future attacks', trait: 'creativity' },
          { text: 'Communicate with the public and manage information flow', trait: 'communication' },
        ],
      },
      {
        text: 'A hospital loses access to patient records. What do you prioritize?',
        options: [
          { text: 'Restore data from secure backups', trait: 'analytical_thinking' },
          { text: 'Work with the hospital staff to find manual workarounds', trait: 'teamwork' },
          { text: 'Quickly adapt the triage system to the new situation', trait: 'adaptability' },
          { text: 'Lead the crisis response and assign roles', trait: 'leadership' },
        ],
      },
      {
        text: 'After the crisis, how do you ensure this never happens again?',
        options: [
          { text: 'Analyze every system vulnerability and create a report', trait: 'analytical_thinking' },
          { text: 'Build a comprehensive training program for all staff', trait: 'communication' },
          { text: 'Innovate a completely new security architecture', trait: 'creativity' },
          { text: 'Organize a city-wide task force for cybersecurity', trait: 'leadership' },
        ],
      },
    ],
  },
  {
    id: 'startup',
    title: 'Startup Launch',
    description: 'You and your friends have a brilliant idea for a new app. You have 3 months to launch.',
    questions: [
      {
        text: 'How do you approach building the product?',
        options: [
          { text: 'Research the market and competitors thoroughly first', trait: 'analytical_thinking' },
          { text: 'Brainstorm wildly creative features that no one has seen', trait: 'creativity' },
          { text: 'Bring together a diverse team with complementary skills', trait: 'teamwork' },
          { text: 'Set an aggressive vision and motivate everyone to execute', trait: 'leadership' },
        ],
      },
      {
        text: 'Your initial product launch gets mixed reviews. What do you do?',
        options: [
          { text: 'Dive into the data and identify exactly what users dislike', trait: 'analytical_thinking' },
          { text: 'Pivot the product idea based on user feedback', trait: 'adaptability' },
          { text: 'Create a compelling marketing campaign to reframe the narrative', trait: 'communication' },
          { text: 'Invent a completely new feature based on the feedback', trait: 'creativity' },
        ],
      },
      {
        text: 'You secure funding but need to scale the team fast. How do you hire?',
        options: [
          { text: 'Design a rigorous interview process to find the best', trait: 'analytical_thinking' },
          { text: 'Build a strong company culture that attracts talent', trait: 'leadership' },
          { text: 'Create an innovative hiring challenge to test skills', trait: 'creativity' },
          { text: 'Leverage your network and ask for referrals', trait: 'communication' },
        ],
      },
    ],
  },
  {
    id: 'climate',
    title: 'Climate Action Challenge',
    description: 'Your community is facing severe environmental challenges. You have been appointed to lead change.',
    questions: [
      {
        text: 'What is your strategy to address the problem?',
        options: [
          { text: 'Analyze environmental data to pinpoint the biggest issues', trait: 'analytical_thinking' },
          { text: 'Organize a town hall and build consensus', trait: 'leadership' },
          { text: 'Design a creative awareness campaign', trait: 'creativity' },
          { text: 'Collaborate with local scientists and residents', trait: 'teamwork' },
        ],
      },
      {
        text: 'A new regulation threatens your current plan. What do you do?',
        options: [
          { text: 'Study the regulation and find legal loopholes', trait: 'analytical_thinking' },
          { text: 'Adapt the plan to comply while still meeting goals', trait: 'adaptability' },
          { text: 'Communicate with officials to negotiate alternatives', trait: 'communication' },
          { text: 'Lead a peaceful advocacy movement', trait: 'leadership' },
        ],
      },
      {
        text: 'How do you sustain momentum long-term?',
        options: [
          { text: 'Track progress with clear metrics and milestones', trait: 'analytical_thinking' },
          { text: 'Empower community members to lead sub-projects', trait: 'leadership' },
          { text: 'Create a fun, gamified program to keep people engaged', trait: 'creativity' },
          { text: 'Build partnerships with other communities', trait: 'teamwork' },
        ],
      },
    ],
  },
];

export const CAREER_DATABASE = [
  {
    title: 'Data Scientist',
    traits: ['analytical_thinking', 'creativity', 'adaptability'],
    description: 'Analyze complex data to help organizations make better decisions.',
    skills: ['Python', 'Statistics', 'Machine Learning', 'Data Visualization'],
    demand: 'Very High - 35% growth expected by 2030',
    growth: 'Lead roles in AI, ML Engineering, or Chief Data Officer',
  },
  {
    title: 'Software Engineer',
    traits: ['analytical_thinking', 'creativity', 'adaptability'],
    description: 'Design and build applications, systems, and software solutions.',
    skills: ['Programming', 'System Design', 'Problem Solving', 'Collaboration'],
    demand: 'High - 25% growth expected by 2030',
    growth: 'Senior Engineer, Architect, or Engineering Manager',
  },
  {
    title: 'Cybersecurity Analyst',
    traits: ['analytical_thinking', 'adaptability', 'communication'],
    description: 'Protect organizations from digital threats and security breaches.',
    skills: ['Network Security', 'Ethical Hacking', 'Risk Analysis', 'Incident Response'],
    demand: 'Very High - 40% growth expected by 2030',
    growth: 'Security Architect, CISO, or Security Consultant',
  },
  {
    title: 'Product Manager',
    traits: ['leadership', 'communication', 'analytical_thinking'],
    description: 'Lead the strategy, roadmap, and delivery of products.',
    skills: ['Strategy', 'User Research', 'Communication', 'Data Analysis'],
    demand: 'High - 22% growth expected by 2030',
    growth: 'Director of Product, VP of Product, or Startup Founder',
  },
  {
    title: 'UX Designer',
    traits: ['creativity', 'communication', 'analytical_thinking'],
    description: 'Design user experiences that are intuitive, accessible, and delightful.',
    skills: ['Design Thinking', 'Prototyping', 'User Research', 'Visual Design'],
    demand: 'High - 18% growth expected by 2030',
    growth: 'Senior Designer, Design Lead, or Creative Director',
  },
  {
    title: 'Healthcare Administrator',
    traits: ['leadership', 'communication', 'teamwork'],
    description: 'Manage healthcare facilities and ensure quality patient care.',
    skills: ['Healthcare Management', 'Regulations', 'Communication', 'Leadership'],
    demand: 'High - 28% growth expected by 2030',
    growth: 'Hospital Director, Health Policy Advisor, or Consultant',
  },
  {
    title: 'Environmental Scientist',
    traits: ['analytical_thinking', 'adaptability', 'teamwork'],
    description: 'Study environmental problems and develop solutions for sustainability.',
    skills: ['Environmental Analysis', 'Research', 'Policy', 'Data Collection'],
    demand: 'High - 20% growth expected by 2030',
    growth: 'Lead Researcher, Policy Advisor, or Consultant',
  },
  {
    title: 'Marketing Strategist',
    traits: ['creativity', 'communication', 'adaptability'],
    description: 'Create campaigns and strategies to connect brands with audiences.',
    skills: ['Digital Marketing', 'Content Creation', 'Analytics', 'Brand Strategy'],
    demand: 'High - 15% growth expected by 2030',
    growth: 'Marketing Director, CMO, or Agency Founder',
  },
  {
    title: 'Teacher / Educator',
    traits: ['communication', 'leadership', 'creativity'],
    description: 'Inspire and educate the next generation of learners.',
    skills: ['Curriculum Design', 'Public Speaking', 'Mentorship', 'Assessment'],
    demand: 'Steady - 10% growth expected by 2030',
    growth: 'Principal, Curriculum Director, or EdTech Founder',
  },
  {
    title: 'Project Manager',
    traits: ['leadership', 'teamwork', 'analytical_thinking'],
    description: 'Plan, execute, and close projects on time and within budget.',
    skills: ['Planning', 'Risk Management', 'Communication', 'Stakeholder Management'],
    demand: 'High - 24% growth expected by 2030',
    growth: 'Program Manager, Portfolio Director, or Operations VP',
  },
  {
    title: 'Research Scientist',
    traits: ['analytical_thinking', 'creativity', 'adaptability'],
    description: 'Conduct experiments and research to advance human knowledge.',
    skills: ['Research Methods', 'Data Analysis', 'Technical Writing', 'Critical Thinking'],
    demand: 'Steady - 12% growth expected by 2030',
    growth: 'Principal Investigator, Lab Director, or Industry Research Lead',
  },
  {
    title: 'Social Worker',
    traits: ['communication', 'empathy', 'teamwork'],
    description: 'Help individuals and communities overcome challenges and improve wellbeing.',
    skills: ['Counseling', 'Case Management', 'Advocacy', 'Cultural Competency'],
    demand: 'High - 19% growth expected by 2030',
    growth: 'Clinical Supervisor, Policy Advocate, or Program Director',
  },
];

export const BADGES = [
  { name: 'Communication Explorer', description: 'Showed strong communication skills', points: 50 },
  { name: 'Problem Solver', description: 'Demonstrated analytical thinking', points: 50 },
  { name: 'Creative Thinker', description: 'Unlocked creative potential', points: 50 },
  { name: 'Future Leader', description: 'Showed leadership qualities', points: 50 },
  { name: 'Team Player', description: 'Excelled in teamwork scenarios', points: 50 },
  { name: 'Adaptable Ace', description: 'Proved adaptability in challenges', points: 50 },
  { name: 'Career Quest Champion', description: 'Completed a Career Quest game', points: 100 },
  { name: 'Interview Star', description: 'Completed the AI Interview with Astra', points: 100 },
  { name: 'Academic Analyzer', description: 'Analyzed academic performance', points: 75 },
  { name: 'Roadmap Ready', description: 'Created a personalized career roadmap', points: 150 },
];
