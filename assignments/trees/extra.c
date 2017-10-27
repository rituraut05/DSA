#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "tree.h"
#include "queue.h"
#include "stack.h"


int print_t(tree tree, int is_left, int offset, int depth, char s[100][255]);

void preorder_norecur(tree t){
	if(t == NULL)
		return;
	stack s;
	sinit(&s);
	push(&s, t);
	while(!empty(&s)){
		t = pop(&s);
		printf("%s ", t->str);
		if(t->right){
			push(&s, t->right);
		}
		if(t->left){
			push(&s, t->left);
		}
	}
}
tree search(tree t, char *str){
	if(t == NULL || !strcmp(t->str, str)){
		return t;
	}
	if(strcmp(t->str, str) < 0)
		return search(t->right, str);
	return search(t->left, str);

}

char* max(tree t) {
	queue q;
	node *p;
	qinit(&q);
	p = t;
	if(!p)
		return NULL;
	char *maxstr = (char *)malloc(sizeof(char) * 128);
	strcpy(maxstr, p->str);
	enqueue(&q, p);
	while(!qempty(&q)) {
		p = dequeue(&q);
		if(strcmp(p->str, maxstr) > 0){
			maxstr[0] = 0;
			strcpy(maxstr, p->str);
		}
		if(p->left)
			enqueue(&q, p->left);
		if(p->right)
			enqueue(&q, p->right);
	}
	return maxstr;
}


int print_t(tree tree, int is_left, int offset, int depth, char s[100][255]){
	char b[100];
	int width = 5;

	if (!tree) 
		return 0;

	sprintf(b, "(%s)", tree->str);

	int left  = print_t(tree->left,  1, offset,                depth + 1, s);
	int right = print_t(tree->right, 0, offset + left + width, depth + 1, s);

	for (int i = 0; i < width; i++)
        	s[2 * depth][offset + left + i] = b[i];

	if (depth && is_left) {

	        for (int i = 0; i < width + right; i++)
        		s[2 * depth - 1][offset + left + width/2 + i] = '-';

        s[2 * depth - 1][offset + left + width/2] = '+';
        s[2 * depth - 1][offset + left + width + right + width/2] = '+';

	}
	else if (depth && !is_left) {

        for (int i = 0; i < left + width; i++)
        	s[2 * depth - 1][offset - width/2 + i] = '-';

        s[2 * depth - 1][offset + left + width/2] = '+';
        s[2 * depth - 1][offset - width/2 - 1] = '+';
	}

	return left + width + right;
}

void printtree(tree tree){
	char s[20][255];
	for (int i = 0; i < 20; i++)
        	sprintf(s[i], "%80s", " ");

	print_t(tree, 0, 0, 0, s);

	for (int i = 0; i < 20; i++)
        	printf("%s\n", s[i]);
}

