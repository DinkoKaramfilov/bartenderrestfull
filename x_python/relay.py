#!/usr/bin/env python
import RPi.GPIO as GPIO
import time
import LCD1602 as lcd

relay = 11
button = 12

def detect(chn):
	pressed = GPIO.input(button)
	if pressed == 1:
		GPIO.output(relay, 1)
	else:
		GPIO.output(relay, 0)
		
	print pressed

if __name__ == '__main__':
	GPIO.setmode(GPIO.BOARD)
	
	GPIO.setup(relay, GPIO.OUT)
	
	GPIO.setup(button, GPIO.IN, pull_up_down=GPIO.PUD_UP)    # Set BtnPin's mode is input, and pull up to high level(3.3V)
	GPIO.add_event_detect(button, GPIO.BOTH, callback=detect, bouncetime=200)
	
	GPIO.output(relay, GPIO.LOW)
	
	lcd.init(0x27, 1)	# init(slave address, background light)
	lcd.write(0, 0, '  The pump is')
	lcd.write(0, 1, 'fully functional!')
	

	try:
		while True:
			pass
			
			
	except KeyboardInterrupt:  # When 'Ctrl+C' is pressed, the child program destroy() will be  executed.
		GPIO.output(relay, GPIO.LOW)
		GPIO.cleanup()

