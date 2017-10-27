#ifndef __STACK_H
#define __STACK_H
#include "tree.h"
#define N 128
typedef struct stack{
	tree a[N];
	int i;
}stack;
void push(stack *s, node* x);
node* pop(stack *s);
int empty(stack *s);
int full(stack *s);
void sinit(stack *s);
#endif
