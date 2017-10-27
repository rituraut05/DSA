#include<stdio.h>
#include<string.h>
#include<stdlib.h>
 int main() {
        typedef struct node {
                char *name;
                struct node *nptr;
                int *iarray;
                int ilen;
        }node;
        node *p, *q, a;
        char name[8], number[8];
        int i;

        a.name = (char *)malloc(5); 
        strcpy(a.name, "coep");
        i = 2;
        p = &a;
        while(i < 10) {
                /* assume all mallocs succeed */
                p->nptr = (node *)malloc(sizeof(node));
                strcpy(name, "coep");                   
                sprintf(number, "%d", i);               
                strcat(name, number);
puts(name);
                p->nptr->name = (char *)malloc(strlen(name) + 1);
                strcpy(p->nptr->name, name);
puts(p->nptr->name);
                p->nptr->iarray = (int *)malloc(sizeof(int) * i);
printf("\n%ld\n",(sizeof(int) * i));
                p->ilen = i;
                q = p;
                p = p->nptr;    
                i = i << 1;
        }
        q->nptr = &a;
printf("%d\n", a.ilen);
	printf("%d",i);
        return 0;
}


