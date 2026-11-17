// ============================================================
// assessmentDemo.js — placeholder content for the assessment
// module, used when no `categories` are passed. Replace it with
// your own questions in config; this exists so the module renders
// something sensible the moment it's dropped onto a page.
// ============================================================

export const demoLevels = [
  { min: 0,  label: 'Ad hoc',    text: 'Technology decisions are mostly reactive. The biggest gains come from agreeing on priorities and who owns them.' },
  { min: 30, label: 'Emerging',  text: 'Good intentions, uneven follow-through. A few repeatable practices would turn effort into consistent results.' },
  { min: 55, label: 'Defined',   text: 'The foundations are in place. The next step is measuring outcomes, not just activity.' },
  { min: 80, label: 'Optimized', text: 'Technology is run as a business capability. Focus on keeping it adaptable as priorities shift.' },
]

export const demoCategories = [
  {
    name: 'Technology Strategy',
    insights: [
      'There is no shared technology roadmap tied to business goals.',
      'A roadmap exists but isn’t consistently used to make decisions.',
      'Strategy is documented and reviewed; tie it more tightly to measurable outcomes.',
      'Strategy and business planning move together. Keep the review cadence.',
    ],
    questions: [
      {
        q: 'How clearly is your technology roadmap tied to business goals?',
        options: [
          'There is no roadmap',
          'A roadmap exists but rarely guides decisions',
          'The roadmap is reviewed against business goals each year',
          'The roadmap is updated as business priorities change',
        ],
      },
      {
        q: 'How effective is your technology operating model at delivering against business needs?',
        options: [
          'Roles and decisions are unclear',
          'Delivery often depends on individual heroics',
          'Accountability and delivery processes are documented',
          'Operating model adapts predictably to changing priorities',
        ],
      },
    ],
  },
  {
    name: 'Operations & Delivery',
    insights: [
      'Work is driven by urgent issues, which crowds out improvement.',
      'Some process exists, but outcomes vary by team and person.',
      'Delivery is predictable; look for automation and measurement next.',
      'Delivery is measured and continuously improved.',
    ],
    questions: [
      {
        q: 'How are technology projects prioritized?',
        options: [
          'Whoever asks loudest gets it',
          'Leadership decides case by case',
          'A defined intake and prioritization process exists',
          'Priorities are scored against business value and revisited regularly',
        ],
      },
      {
        q: 'How do you know whether a technology investment paid off?',
        options: [
          'We generally don’t',
          'Anecdotally, after the fact',
          'Success measures are set before projects start',
          'Outcomes are tracked and reported to leadership',
        ],
      },
    ],
  },
  {
    name: 'Data & Security',
    insights: [
      'Security and data practices leave real exposure.',
      'Basics are covered but not tested or owned.',
      'Controls are documented; test them regularly.',
      'Security and data are managed as ongoing disciplines.',
    ],
    questions: [
      {
        q: 'How confident are you in your ability to recover from a ransomware attack?',
        options: [
          'Not confident',
          'We have backups but haven’t tested a restore',
          'Backups are tested and a recovery plan exists',
          'Recovery is rehearsed and meets defined targets',
        ],
      },
      {
        q: 'How is access to systems and data managed?',
        options: [
          'Shared accounts and informal access',
          'Individual accounts, but access is rarely reviewed',
          'Role-based access with periodic reviews',
          'Access is automated, reviewed and audited',
        ],
      },
    ],
  },
]
