#include <stdio.h>
#include "queue.h"

int main(){
	int i, j = 0;
	char c;
	queue q;
	while(1){
		scanf("%d", &i);
		switch(i){
			case 1:
				//fflush(stdin);
				getchar();
				scanf("%c", &c);
				
				enqueue(&q, c);
				break;

			case 2:
				dequeue(&q);
				break;
			default:
				break;
		}
		qprint(&q);
		j++;
	}
	return 0;
}
