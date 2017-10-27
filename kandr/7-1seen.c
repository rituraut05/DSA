#include<stdio.h>
#include<ctype.h>
#include<string.h>
 
//lower: converts upper case to lower case
//upper:converts upper case to lower case
 
main(int argc, char *argv[])
{
 int c;
 if(strcmp(argv[0],"lower") == 0)
  while((c = getchar()) != EOF)
   putchar(tolower(c)) != EOF)
   else
    while(c = getchar()) != EOF)
    putchar(toupper(c));
    return 0;
}
