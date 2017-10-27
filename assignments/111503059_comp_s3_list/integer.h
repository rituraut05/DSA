
#ifndef __INTEGER_H
#define __INTEGER_H
enum{NEG, POS};
typedef struct node{
	char n;
	struct node *next;
	struct node *prev;
	
}node;

typedef struct Integer{
	node *head;
	node *firstdig;
	node *lastdig;
	int sign;
	int digno;
}Integer;

Integer *CreateIntegerFromString(char *str);
void print_number(Integer *number);
Integer *AddIntegers(Integer *a, Integer *b);
Integer *SubstractIntegers(Integer *a, Integer *b);
int GreaterInteger(Integer *a, Integer *b);
#endif
