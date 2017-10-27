
/*****************************************************************************
 * Copyright (C) Abhijit A.M. abhijit13@gmail.com
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston MA 02110-1301, USA.
 *****************************************************************************/

#include <stdio.h>
#include <stdlib.h>
#include "tree.h"
void printmenu() {
	printf("\n1. insert\n");
	printf("2. remove\n"); 
	printf("3. breadth-wise traversal\n");
	printf("4. copy\n");
	printf("6. exit\n");
	printf("5. count the number of leaf nodes\n");
}
int main() 
{
	tree t, w;
	int choice;
	char str[16];
	init(&t);
	while(1) {
		printf("Depth: %d  Count %d \n", depth(t), count(t));
		printf("inorder:"); inorder(t); printf("\n"); 
		printf("preorder:"); preorder(t); printf("\n");
		printf("postorder:"); postorder(t); printf("\n");
		//print(t);

		printmenu();

		scanf("%d", &choice);
		getchar();
		switch(choice) {
			case 1:
				printf("enter str\n");
				scanf("%s", str);
				//getchar();
				insert(&t, str);
				break;
			case 2:
				printf("Enter char to remove\n");
				scanf("%s",str);
				delete(&t, str);
				break;
			case 3:
				levelwise(t);
				break;
			case 4:
				w = copy(t);
				//print(w);
				break;
			case 5:
				printf("Number of leaft nodes: %d\n", count_leaf_nodes(t));
				break;
			case 6: 
				exit(0);
			break;
		}
	}
}
