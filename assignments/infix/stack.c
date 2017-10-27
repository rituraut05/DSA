#include "stack.h"
void PushOpnd(struct opndstack *s, int num){
	s->a[s->i]= num;
	(s->i)++;
}

int PopOpnd(struct opndstack *s)
{
	int t = s->a[s->i - 1];
	(s->i)--;
	return t;
}


void PushOptr(struct optrstack *s, char op){
	s->a[s->i]= num;
	(s->i)++;

}

char PopOptr(struct optrstack *s){
	char t = s->a[s->i - 1];
	(s->i)--;
	return t;
}
int emptyOptr(struct optrstack *s) {
	return s->i == 0;
}
int fullOptr(struct optrstack *s) {
	return s->i == MAX;
}
int emptyOpnd(struct opndstack *s) {
	return s->i == 0;
}
int fullOpnd(struct opndstack *s) {
	return s->i == MAX;
}

