// config/pages/assessment.js —
export const page = {
    "slug": "assessment",
    "name": "Assessment",
    "view": "rows",
    "seo": {
      "title": "Assessment Questionaire - DJJ",
      "description": "The people and the principles behind DJJ."
    },
    "rows": [
      {
        "flush": true,
        "modules": [
          {
            "module": "assessment",
            
          }
        ]
      },
      {
        "flush": true,
        "modules": [
          {
            "module": "stats",
            "props": {
              "items": [
                {
                  "value": "2,400+",
                  "label": "Businesses served"
                },
                {
                  "value": "98%",
                  "label": "Client retention"
                },
                {
                  "value": "4.9/5",
                  "label": "Average rating"
                },
                {
                  "value": "<2hrs",
                  "label": "Support response"
                }
              ]
            }
          }
        ]
      },
      {
        "flush": true,
        "modules": [
          {
            "module": "features",
            "props": {
              "eyebrow": "What we believe",
              "title": "How we work",
              "columns": 3,
              "items": [
                {
                  "icon": "①",
                  "title": "Plain answers",
                  "text": "No jargon, no upsell scripts. If we are not the right fit, we will say so."
                },
                {
                  "icon": "②",
                  "title": "Built to last",
                  "text": "We would rather do fewer things properly than ship everything at once."
                },
                {
                  "icon": "③",
                  "title": "People first",
                  "text": "Software helps. People make the difference. You will always reach a human."
                }
              ]
            }
          }
        ]
      },
      {
        "flush": true,
        "modules": [
          {
            "module": "team",
            "props": {
              "eyebrow": "The team",
              "title": "The people you will talk to",
              "members": [
                {
                  "name": "Full Name",
                  "role": "Role / Title",
                  "image": "https://picsum.photos/seed/svc-team-1/400/400",
                  "bio": "One line about this person."
                },
                {
                  "name": "Full Name",
                  "role": "Role / Title",
                  "image": "https://picsum.photos/seed/svc-team-2/400/400",
                  "bio": "One line about this person."
                },
                {
                  "name": "Full Name",
                  "role": "Role / Title",
                  "image": "https://picsum.photos/seed/svc-team-3/400/400",
                  "bio": "One line about this person."
                },
                {
                  "name": "Full Name",
                  "role": "Role / Title",
                  "image": "https://picsum.photos/seed/svc-team-4/400/400",
                  "bio": "One line about this person."
                }
              ]
            }
          }
        ]
      },
      {
        "flush": true,
        "modules": [
          {
            "module": "cta",
            "props": {
              "title": "Ready to see what DJJ can do?",
              "text": "Book a free 20-minute call. No pressure, just a straight answer about whether we fit.",
              "cta": {
                "label": "Get started",
                "to": "/contact"
              }
            }
          }
        ]
      }
    ]
  }
