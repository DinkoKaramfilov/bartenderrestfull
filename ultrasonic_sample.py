#!/usr/bin/env python
import RPi.GPIO as GPIO
import time

TRIG = 11
ECHO = 12

lights = [13, 15, 16]

GPIO.setmode(GPIO.BOARD)
GPIO.setup(TRIG, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)

for light in lights:
	GPIO.setup(light, GPIO.OUT)

GPIO.output(TRIG, 0)

	
try:
	while True:
		time.sleep(0.05)
		
		GPIO.output(TRIG, 1)
		time.sleep(0.00001)
		GPIO.output(TRIG, 0)

		while GPIO.input(ECHO) == 0: a = 0
		time1 = time.time()
		while GPIO.input(ECHO) == 1: a = 1
		time2 = time.time()
		
		dist = (time2 - time1) * 340 * 0.5 * 100
		
		for index, light in enumerate(lights):
			GPIO.output(light, dist < (index + 1) * 5)
		
		print dist
		
		
except KeyboardInterrupt:
	GPIO.cleanup()
