# KOR Website

## Branching workflow

Always work on a feature branch — never commit directly to `main`.

Before starting any design review, bug fix, or feature work:

```bash
git checkout main && git pull origin main
git checkout -b <type>/<short-description>
# e.g. design/article-contrast-fixes
#      fix/nav-overflow
#      feat/personal-plans-page
```

When the work is done, push the branch and open a PR:

```bash
git push -u origin <branch-name>
gh pr create
```

This keeps `main` clean and lets changes go through code review before landing.

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
