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
int count_leaf_nodes(tree t);
void levelwise(tree t);
void printree(tree t);
tree copy(tree t); 
#endif
