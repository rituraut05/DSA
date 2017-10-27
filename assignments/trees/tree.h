#ifndef __TREE_H
#define __TREE_H

typedef struct node {
	char *str;
	struct node *left, *right;
}node;
typedef node *tree;
void init(tree *t);
void insert(tree *t, char *str);
void delete(tree *t, char *str);
void inorder(tree t); /* LNR */
void preorder(tree t);
void postorder(tree t);
int depth(tree t);
int count(tree t);
void levelwise(tree t);
void printtree(tree t);
tree copy(tree t); 
void preorder_norecur(tree t);
tree search(tree t, char *str);
char *max(tree t);
int print_t(tree tree, int is_left, int offset, int depth, char s[100][255]);

#endif
