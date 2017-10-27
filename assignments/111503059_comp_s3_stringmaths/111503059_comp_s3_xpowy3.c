#include <stdio.h>
#include <stdlib.h>
double power(int x, int y) {
	int sign = 0;
	long term, result;
	if(x==0) 
		if(y == 0) {
			printf("Bad Input \n");
			exit(1);
		}
		else 
			return 	0.0;
	else /* x!=0 */ {
		if(y == 0)
			return 1.0;
		else /* x!=0 y!=0 */{
			if(y < 0) {
				sign = 1;
				y = -y;
			}	
			term = x; 
			result = 1;
			while(y) {
				if(y%3 == 2)
					result = result * term * term; 
				if(y%3 == 1)
					result = result * term;
				y /= 3;
				term = term * term * term;
			}
			if(sign) 
				return (1.0)/result;	
			else 
				return (double)result;	
		}	
	}
}
int main() {
	int x, y;
	scanf("%d%d",&x,&y);
	printf("%f\n",power(x,y));
}
