# TongLab
## Node.js Amazon Mechanical Turk Web Experiment Distribution Application

## Overview

## Changelog
### 6/18/2016 - 1/1/2017
```
- final sequence set
	1. motor practice
	2. randomly generated practice (2 items)
	3. pregenerated practice (6 items)
	4. pregenerated experiment trials
- added subject information section
- added post-experiment questionnaire
- edited and finalized instruction content
- added card measurement component, removed specific screen size selection
- added, retained three viewing distance selections
- AJAX calls to server script locations (cgi-bin) to run associated actions
	- user closes application, begins experiment, submits HIT

- server configuration
	- web server configured to run cgi scripts
		- wrote Perl scripts
			- compLists.pl
				- opens status.txt and participants.txt
				- marks user as completed (2)
				- records time of completion
			- incompLists.pl
				- clears user that closed experiment
					- next implementation will keep track and restrict interrupted users
				- reopens status.txt slot (0)
				- removes user in participants.txt
			- save.pl
				- saves experiment JSON as text file
			- startLists.pl
				- registers user in status.txt (1)
				- records user and start time in participants.txt
```

### 6/17/2016
```
- fixed fixation layering (covered by response patch during report phase)
- fixed trial progression ordering issue
- at this point the experiment progression is largely done
	- primary action components (instructions, start, generate experiment, show array, response)
		- operates through loop information stored in a struct
	- ability to adapt to conditions of the browser window.
- added rough code for selecting response targets (circles)
	- somewhat cleaned up, may be reviewed if better implementations arise
```

### 6/16/2016
```
- applied a better solution to target offset issue to allow for hierarchy within #showTrial divisor
- linked major phases into continuous working loop (no data record or feedback)
- set up fixation at fixed location
```

### 6/15/2016
```
- cleaned up rough working code and tested visual array display via css properties
	- able to display targets in centered location (fixed offset issue)
- fixed random seeding to be date based (from 1970)
```

### 6/14/2016
```
- wrote rough complete code for random angle spacing distribution calculating code
	- minor errors to be fixed
```

### 6/13/2016
```
- added instruction formatting
	- introduced viewing distance selection option and clear
- fixed gabor radius calculation algorithm
- added gabor update function for system specification selections
- building initial setup for showTrial phase
```

### 6/10/2016
```
- foundation for partially controlling visual angle was written up
- default values of screen size, browser resolution, viewing distance (calculated into visual angle) 
	- based on majority users of browser statistics
	- system that prompts the user to input screen size and viewing position (chosen based on provided diagram) could be used to further increase visual size consistency
- possible approaches to calculating random placement of targets within an eccentricity thought out
- trial generation, randomization, and shuffling was set up
	- random splitting of the available angle for spacings of targets to be determined
- next trial mechanisms and starting the experiment was written
- instructions to be further developed while angle spltting is further thought out
```

### 6/9/2016
```
- updated on the specific details of the paradigm in Amazon mTurk format and  implementation in MATLAB
	- requested Young Eun's MATLAB source to be sent over
		- access to specific values but too impractical to try to locate relevant pieces of code 
			- program build up from previous studies, includes snippets of no op code
			- decided code would be written in my style to emulate how the paradigm on MATLAB
- discussions to possibly establish a scaling foundation to make the visual display conditions flexible
- possible approaches to calculating random placement of targets within an eccentricity brainstormed
```

### 6/8/2016
```
- able to implement dynamic rotation on the HTML attached
- sourced available lightweight online plugin that provided rotation functions
	- applied to Brady's example structure
		- local image file grating tested
```

### 6/7/2016
```
- To continue from before, the grating image should be generated within MATLAB and hosted
- Question of catch trials without transparency?
- It should be noted that once a working program is developed, Brady's Turk introduction video should be revisited for general optimal practices in test population management and response
- To quote Brady, "The response times measured by JavaScript were approximately 25 ms longer than those measured by PTB [PsychToolBox]. However, we found no reliable difference in the variability of the distributions related to the software, and both software packages were equally sensitive to changes in response times as a result of the experimental manipulations. We concluded that Javascript is a suitable tool for measuring reponse times in behavioral research."
- Running more subjects with fewer trials is the better option, likely within 40 - 60 (possibly up to 100) trials
	- More power and a more precise estimate of the effect of size with this approach
- https://psiturk.org/ - provides additional information on server infrastructure which may be useful for blocking repeating participants and hosting items
- While Brady states that HTML, CSS, Javascript, Python, Perl, and MATLAB are all used as part of his pipeline, it's is likely that HTML, CSS, and Javascript are primarily used for the experiment functioning itself while Python, Perl, and MATLAB are utilized in server-side management and data conversion for analysis in MATLAB
```

### 6/6/2016
```
- Brady seems to utilize Javascript as the primary method of generating interactive stimuli and gathering relevant information (i.e. mouse location) for updating displays
- Brady provides relatively simple examples of visual tasks that are hosted on his website. As pointed out in the introduction video (Mechanical Turk Tutorial page), all source code for online HITs (also Brady's examples) is available by simply right-clicking and choosing to view the page source (Google Chrome recommended)
	- As a result, Brady's provided examples give a substantial skeleton for designing a randomized trial-based experiment along with a continuously updated response interface
		- The code found in the link below contains a response stage that continuously updates the response color (displayed as a circle in the center of the screen) dependent on the hovering mouse location (degrees in a circle). This behavior can be largely translated over into a response environment that produces and rotates a sine grating depending on the position of the mouse. 
			- view-source:http://timbrady.org/turk/ensembleindivdiff/e9/
- There are options that may be taken in the generation of a sine grating, but the lack of a direct methods to generate a meshgrid and convert these arrays into an image suggests that a preloaded image manipulation may be more conventional than manually constructing a patch within the program itself. The varied sets of systems that will be running this program with different display specifications further enforces the futility of trying to generate a personalized patch to maintain control of the visual angle.
- On the issue of visual angle, it is likely possible to gain information of the system window resolution, however the information about screen DPI, which is also necessary is likely not available from the client to server. If both the screen resolution and DPI is available, the program would likely simply manipulate the pixel size of the stimulus. 
- Image manipulation will likely include HTML canvas which allows for image rotation
- Experimental design is simple to set up and very similar to MATLAB. Javascript equivalences to MATLAB functions will have to be explored
```