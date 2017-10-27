#include<stdio.h>
void stricat(char *s, char *t){
	
	//while(*s++!= '\0')
	//	;
 
	//for(int i=0; *t != '\0'; t++, s++){
	//	*s = *t;
	//}
	//*s = '\0';
	//	printf("%s", s);   //This does not give us any result 

    while (*++s)
        ;
    while (*s++ = *t++)
        ;

}
int main(){
	char a[10], b[10];
	scanf("%s", a);
	scanf("%s", b);
	stricat(a, b);
	printf("%s\n", a);
	return 0;
}	
