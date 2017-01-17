/*

On your Raspberry Pi:

Install wiringPi from command line:
git clone git://git.drogon.net/wiringPi
cd wiringPi
./build

Set build commands in Geany:
Compile: gcc -Wall "%f" -lwiringPi -lpthread
Execute: sudo ./a.out

Make sure button is plugged into GPIO17, red into GPIO18, green into GPIO27, and blue into GPIO22
Press Compile button (pyramid pointing to ball)
Press Run (paper airplane)
*/

// include necessary libraries. They add functions and constants to the script.
#include <wiringPi.h>
#include <stdio.h>
#include <time.h>

/* Here's where we define our buttons. In C, constants are often defined 
 * with compiler directives for some reason. So these are not really 
 * variables but more like aliases that can't be changed by the program.
 * 
 * Also, wiringPi refers to the pins by numbers that don't seem to make 
 * any sense, so here's a mapping of the first 8 available GPIO pins.
 * 
 * CODE - BOARD
 *  0	  GPIO17
 *  1     GPIO18
 *  2     GPIO27
 *  3     GPIO22
 *  4     GPIO23
 *  5     GPIO24
 *  6     GPIO25
 *  7     GPIO4
 */
#define btnPin		0 // 17
#define ing1Pin		1 // 18
#define ing2Pin		2 // 27
#define ing3Pin		3 // 22

// This variable and function are used to detect if the button has been pressed.
// It returns true if the button is pressed but wasn't last time it was called
int prevButtonUp = 1;
int buttonPressed(int pin){
	int buttonUp = digitalRead(pin);
	int pressed = buttonUp == 0 && prevButtonUp == 1;
	prevButtonUp = buttonUp;
	return pressed;
}

// get the current time (in milliseconds since 1970, of course)
// I had to google around to find this. Might as well be magic.
long now(){
	
	// the time will be saved into "t", a timespec structure
	struct timespec t; 
	
	// get the time, save it into "t"
	clock_gettime(CLOCK_MONOTONIC_RAW, &t);
	
	// convert the seconds to ms and the nanoseconds to ms and add them together 
	return t.tv_sec * 1000 + t.tv_nsec / 1000000; 
}

// specify how many milliseconds for each ingredient this function will 
// keep them on for that long until the last one turns off
void makeRecipe(int ing1Time, int ing2Time, int ing3Time){
	long startTime = now();
	long timeSinceStart;
	printf("Start: %ld\n", startTime);
	
	do {
		timeSinceStart = now() - startTime;
		printf("Time: %ld\n", timeSinceStart);
		
		digitalWrite(ing1Pin, timeSinceStart < ing1Time);
		digitalWrite(ing2Pin, timeSinceStart < ing2Time);
		digitalWrite(ing3Pin, timeSinceStart < ing3Time);
		
		delay(20);
	} while (
		timeSinceStart < ing1Time || 
		timeSinceStart < ing2Time || 
		timeSinceStart < ing3Time
	);
}

// this is the main function, it gets called automatically when the program starts
int main(int argc, char *argv[]){
	
	// set up wiringPi. Stop the program if there's a problem.
	if(wiringPiSetup() == -1){
		printf("setup wiringPi failed!");
		return 1; 
	}
	
	// set the inputs and outputs
	pinMode(ing1Pin, OUTPUT);
	pinMode(ing2Pin, OUTPUT);
	pinMode(ing3Pin, OUTPUT);
	pinMode(btnPin, INPUT);
	
	// initialize the outputs
	digitalWrite(ing1Pin, 0);
	digitalWrite(ing2Pin, 0);
	digitalWrite(ing3Pin, 0);
	
	// the are hardcoded for now, but eventually we'll get them as inputs
	int ing1Time = 5000;
	int ing2Time = 4000;
	int ing3Time = 6000;
	
	// If we've gotten this far, everything is ready. Print something to the screen.
	printf("Press the button.\n");
	
	// This is the event loop, it just runs over and over until the program is forcefully ended.
	while(1){
		
		if (buttonPressed(btnPin)){
			printf("SOMEONE PRESSED THE BUTTON!\n");
			makeRecipe(ing1Time, ing2Time, ing3Time);
		}
		
		// sleep for 20 cycles. No point in running the loop super fast.
		delay(20);
	}
}
