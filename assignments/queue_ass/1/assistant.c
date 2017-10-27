#include <stdio.h>
#include "structq.h"

void printmenu() {
	printf("1. New patient\n");
	printf("2. Send Patient in\n");
	printf("3. exit\n");
}
int main() {
	queue q;
	data d;
	int choice;
	qinit(&q);
	while(1) {
		printmenu();
		scanf("%d", &choice); 
		switch(choice) {
			case 1:
				scanf("%s%d", d.name, &d.age);
				getchar();
				if(!qfull(&q))
					enqueue(&q, d);
				else {
					printf("Patient go home. business in full swing\n");
					continue ;
				}
				break;
			case 2:
				if(!qempty(&q)) {
					d = dequeue(&q);
					printf("send %s %d in\n", d.name,d.age);
				} else {
					printf("No patients. Close the dukaan\n");
					continue ;
				}
				break;
			case 3:
				return 0;
		}
	}
	return 0;
}
