
#include <stdio.h>
#include "stackqueue.h"
//#include "stacksforqueue.h"
int main(){
	int i, x;
	while(1){
		scanf("%d", &i);
		switch(i){
			case 1:
				scanf("%d", &x);
				enqueue(x);
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
