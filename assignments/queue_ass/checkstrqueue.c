
#include <stdio.h>
#include "strqueue.h"

int main(){
	int i;
	char *s;
	while(1){
		scanf("%d", &i);
		switch(i){
			case 1:
				scanf("%s", s);
				enqueue(s);
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
