#include <stdio.h>
#include <stdlib.h>
#include "queueandlist.h"
void printmenu() {
	printf("1. New patient\n");
	printf("2. Send patient to doctor\n");
	printf("3. Exit\n");
}
int main() {
	int name, n;
	int choice;
	queue q;
	qinit(&q);
	while(1) {
		printmenu();
		scanf("%d", &choice);
		switch(choice) {
			case 1:
				if(!qfull(&q)) {
					scanf("%d", &name);
					enqueue(&q, name);
				} else {
					printf("Patient go home, business in full swing\n");
					continue;
				}
				break;
			case 2:
				if(!qempty(&q)) {
					n = dequeue(&q);
				} else {
					printf("No patients. Doctor, close the dukaan\n");
					continue;
				}
				break;
			case 3:
				return 0;
			default:
				break;
		}
		qprint(&q);
	}
	return 0;
}
