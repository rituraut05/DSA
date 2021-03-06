#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "tree.h"
#include "queue.h"
#define LEFT 1
#define RIGHT 2
void init(tree *t) {
	*t = NULL;
}
void insert(tree *t, char *str) {
	/* create a new node and copy data in it
	 * Loop { 
	 *  check if current node is > or < than given value
	 *  go to left or right accordingly
	 * } till NULL
         * insert the new data "here"
	 * 
	 */
	int direction;
	node *tmp, *p, *q;
	tmp = (node *)malloc(sizeof(node));
	tmp->str = (char *)malloc(strlen(str) + 1);
	strcpy(tmp->str, str);
	tmp->left = tmp->right = NULL;
	if(*t == NULL) {
		*t = tmp;
		return;
	}
	p = *t;
	while(p) {
		q = p;
		if(strcmp(p->str, str) > 0) {
			p = p->left;
			direction = LEFT;
		} else {
			p = p->right;
			direction = RIGHT;
		}
	}
	if(direction == RIGHT)
		q->right = tmp;
	else
		q->left = tmp;
		
}
void delete(tree *t, char *str) {
	tree p, q, r, tp;
	int direction, res;
	/* find the node */
	p = *t;
	while(p) {
		res = strcmp(p->str, str);
		if(res == 0)
			break;
		q = p;
		if (res < 0) {
			p = p->right;
			direction= RIGHT;
		}
		else {
			p = p->left; 
			direction = LEFT;
		}
	}
	if(!p)
		return;
	/* case 1: leaf node
	 * find noode, delete node, set parent's pointer to NULL
	 */
	if(p->left == p->right) {
		free(p->str);
		free(p);
		if(p == *t) {
			*t = NULL;
			return;
		}
		if(direction == RIGHT)
			q->right = NULL;
		else
			q->left = NULL;
		return;
	}
	/* case 2: one child
	 * find node, delete node, attach child to grandparent 
	 */
	if(p->left == NULL && p->right != NULL) {
		if(direction == RIGHT)
			q->right = p->right;
		else
			q->left = p->right;
		free(p->str);
		free(p);
		return;
	}
	if(p->left != NULL && p->right == NULL) {
		if(direction == RIGHT)
			q->right = p->left;
		else
			q->left = p->left;
		free(p->str);
		free(p);
		return;
	}
	/* case 3: two children
	 * find node (say P)
	 * find leftmost of right substree (say T)
	 * bring T in place of P
	 * now delete T (using case 1 or 2 
	 */
	r = p->right;
	while(r->left) {
		tp = r;
		r = r->left;		
	}
	free(p->str);
	p->str = r->str;
	if(r == p->right) 
		p->right = r->right;	
	else
		tp->left = r->right;
	free(r);
}
void inorder(tree t) { /* LNR */
	if(t == NULL)
		return;
	inorder(t->left);
	printf("%s ", t->str);
	inorder(t->right);	
}
void preorder(tree t) {
	if(t == NULL)
		return;
	printf("%s ", t->str);
	preorder(t->left);
	preorder(t->right);	
}
void postorder(tree t) {
	if(t == NULL)
		return;
	postorder(t->left);
	postorder(t->right);	
	printf("%s ", t->str);
}
#define MAX(a,b ) ((a) > (b) ? (a): (b))
int depth(tree t) {
	if(t == NULL)
		return -1;
	return 1 + MAX(depth(t->left), depth(t->right));	
}
int count(tree t) {
	if(t == NULL)
		return 0;
	return 1 + count(t->left) + count(t->right);
}
int count_leaf_nodes(tree t)  {
	if(t == NULL)
		return 0;
	else if(t->left == NULL && t->right == NULL)
		return 1;
	else
		return count(t->left) + count(t->right);
}
void levelwise(tree t) {
	queue q;
	node *p;
	qinit(&q);
	p = t;
	if(!p)
		return;
	printf("levelwise: [");
	enqueue(&q, p);
	while(!qempty(&q)) {
		p = dequeue(&q);
		printf("%s ", p->str);
		if(p->left)
			enqueue(&q, p->left);
		if(p->right)
			enqueue(&q, p->right);
	}
	printf("]\n");
}
tree copy(tree t) { 
	if(t == NULL)
		return NULL;
	tree tmp = (tree) malloc(sizeof(node));
	tmp->str = (char *)malloc(strlen(t->str) + 1);
	strcpy(tmp->str, t->str);
	tmp->left = copy(t->left);
	tmp->right = copy(t->right);
	return tmp;	
}
/**********************************************Practice Codes************************************************************/


