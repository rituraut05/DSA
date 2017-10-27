#include<stdio.h>
int main(){
	int c, ns = 0;
	
	while((c = getchar()) != EOF){
		if(c == ' '){
			++ns;
		}
		else 
			ns = 0;
		if(ns <= 1){
			putchar(c);
		}
	}
	/*int c;
	while ((c = getchar()) != EOF) {
    	    if (c == ' ') {
    		    while ((c = getchar()) == ' ');
    	    putchar(' ');
    	    if (c == EOF) break;
    	    }
    	putchar(c);
	}*/
/*while ch = getchar()
   if ch != ' '
      putchar(ch)
   if ch == ' '
      if last_seen_ch != ch
         putchar(ch)
   last_seen_ch = ch*/
	
	return 0;
}

