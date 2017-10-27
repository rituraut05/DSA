#include <stdio.h>
#include "2.h"
int main(){
	while(1){
		printf("1. appendleft\n2. popright\n 3.exit\n");
		scanf("%d", &choice);
		switch(choice){
			case 1:
				printf("Enter your name and age\n");
				scanf("%s%d", name, age);
				appendleft(l, name, age);
				break;
			case 2:
				data *d;
				d = popright(l);
				printf("name = %s  age = %d\n", d->name, d->age);
				break;
			case 3:
				return;
		}
	}
}
