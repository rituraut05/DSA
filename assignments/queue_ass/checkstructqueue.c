

#include <stdio.h>
#include "structqueue.h"

int main(){
	int i;
	struct data *d;
	while(1){
		scanf("%d", &i);
		switch(i){
			case 1:
				scanf("%s%d", d->name, &d->age);
				enqueue(d);
				break;

			case 2:
				dequeue();
				break;
			default:
				break;
		}
		printdata();
	}
	return 0;
}
