TEMPLATE FOR RETROSPECTIVE (Team ##)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done

  Stories committed: 2 vs. Stories done: 2 

- Total points committed vs. done 

  Points committed: 3 vs. Points committed: 3 

- Nr of hours planned vs. spent (as a team)

  hours planned: 57h vs. hours done: 54h 55m

**Remember** a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing: 18
- Code review completed: 3h 20m
- Code present on VCS: 
- End-to-End tests performed: 11

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story         | # Tasks  | Points | Hours est. | Hours actual |
|---------------|----------|--------|------------|--------------|
| UNCATEGORIZED | 8        |        | 35h 55m    | 35h 55m      |
| GET TICKET    | 8        | 1      | 10h 30m    | 10 40m       |
| NEXT CUSTOMER | 14       | 2      | 9h 30m     | 8h 20m       |  

> story `Uncategorized` is for technical tasks, leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)

|            | Mean | StDev |
|------------|------|-------|
| Estimation | 1,97 | 2,46  | 
| Actual     | 1,89 | 2,48  |

- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$
    = -0.03655
    
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$

    = 0,03132
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 3h 30m
  - Total hours spent: 2h 30m
  - Nr of automated unit test cases: 18
  - Coverage: 62.32%
- E2E testing:
  - Total hours estimated: 4h
  - Total hours spent: 4h
  - Nr of test cases: 11
- Code review 
  - Total hours estimated: 4h
  - Total hours spent: 3h 20m
  


## ASSESSMENT

- What did go wrong in the sprint?

  We should have spent more time designing the APIs before the actual development started

  We should have had test sessions to test the product more frequently

- What caused your errors in estimation (if any)?

  Error was caused by inexperiece in the estimation and in particular we underestimated coding time and slightly overestimated testing time

- What lessons did you learn (both positive and negative) in this sprint?

  We learned how to collaborate more effectively and to use the tools required for the project

- Which improvement goals set in the previous retrospective were you able to achieve? 

  This was our first project, but we achieved our goal of delivering a functional app and working well as a team
  
- Which ones you were not able to achieve? Why?

  /

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  - Plan more time for design
  - Perform intermediate manual testing during development (so features get tested more frequently)

- One thing you are proud of as a Team!!

  We built a working, user-friendly app and collaborated effectively on our first group project.