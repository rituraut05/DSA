#include "stack.h"
#include "tree.h"
void push(stack *s, node* x) {
	s->a[s->i]= x;
	(s->i)++;
}
/* the caller should check that the stack is not empty before calling pop() 
 */
node* pop(stack *s) {
	tree t = s->a[s->i - 1];
	(s->i)--;
	return t;
}
int empty(stack *s) {
	return s->i == 0;
}
int full(stack *s) {
	return s->i == N;
}
/* It is mandatory to call init() on a stack before calling push, pop or any other function on the stack 
 */
void sinit(stack *s) {
	s->i = 0;
}
