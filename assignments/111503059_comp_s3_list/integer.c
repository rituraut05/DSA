#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include "integer.h"
int addition = 0, substraction = 0;
Integer *CreateIntegerFromString(char *str){
	int i = 0, count = 0;
	Integer *number;
	node *num;
	num = (node *)malloc(sizeof(node));

	number = (Integer *)malloc(sizeof(Integer));
	if(str[i] == '-'){
		number->sign = NEG;
		num->n = '-';
		num->next = NULL;
		num->prev = NULL;
		i++;
	}
	else if(str[i] == '+'){
		number->sign = POS;
		node *num;
		num = (node *)malloc(sizeof(node));
		num->n = '+';
		num->next = NULL;
		num->prev = NULL;

		i++;
	}
	else{
		number->sign = POS;
		num->n = '+';
		num->next = NULL;
		num->prev = NULL;
		
		
	}
	
	num->next = (node *)malloc(sizeof(node));
	num->next->n = str[i];
	num->next->prev = num;
	num = num->next;
	num->next = NULL;
	//num->prev = NULL;
	number->head = (node *)malloc(sizeof(node));
	number->head = num->prev;
	number->firstdig = (node *)malloc(sizeof(node));
	number->firstdig = num;
	count++;
	i++;
	while(str[i]){
		num->next = (node *)malloc(sizeof(node));
		num->next->n = str[i];
		num->next->prev = num;
		num = num->next;
		num->next = NULL;

		i++;
		count++;
		
	}
	num->next = NULL;
	number->lastdig = num;
	
	number->digno = count;
	return number;
}
Integer *AddIntegers(Integer *a, Integer *b){
	addition = 1;
	printf("In add addition is %d and substraction is %d\n", addition, substraction);
	if(a->sign == NEG && b->sign == POS && !substraction){
		return SubstractIntegers(b, a);
	}
	else if(a->sign == POS && b->sign == NEG && !substraction){
		return SubstractIntegers(a, b);
	}
	else {
		int count = 0;
		Integer *add;
		add = (Integer *)malloc(sizeof(Integer)); 
		print_number(a);
		printf("\n+\n\n");
		print_number(b);
		node *ans, *num1, *num2;
		ans = (node *)malloc(sizeof(node));
		num1 = a->lastdig;
		num2 = b->lastdig;	
		int carry = 0;
		int answer, n1, n2;
		while(num1->prev && num2->prev){
			answer = num1->n - '0' + num2->n - '0' + carry;
			ans->n = answer + '0';
			if((ans->n - '0') >= 10){
				answer = answer - 10;
				ans->n = answer + '0';
				carry = 1;
			}
			else
				carry = 0;
//printf("%c ", ans->n);
			ans->prev = (node *)malloc(sizeof(node));
			ans->prev->next = ans;
			ans = ans->prev;
			num1 = num1->prev;
			num2 = num2->prev;
			count++;
		}
		while(num1->prev){
			answer = num1->n - '0' + carry;
			ans->n = answer + '0';
                	if((ans->n - '0') >= 10){
				answer = answer - 10;
				ans->n = answer + '0';
                        	carry = 1;
                	}
                	else
                	        carry = 0;

			ans->prev = (node *)malloc(sizeof(node));
			ans->prev->next = ans;
			ans = ans->prev;
			num1 = num1->prev;
			count++;
		}
		while(num2->prev){
			answer = num2->n - '0' + carry;
			ans->n = answer + '0';
                	if((ans->n - '0') >= 10){
				answer = answer - 10;
                        	carry = 1;
               	 	}
                	else
                        	carry = 0;

			ans->prev = (node *)malloc(sizeof(node));
			ans->prev->next = ans;
			ans = ans->prev;
			num2 = num2->prev;
			count++;
		}
		ans->prev = NULL;
//printf("lololol   %c |||", ans->n);
count--;
	ans = ans->next;
	while(ans->n == '0'){
//printf("check for zeroes\n");
		ans = ans->next;
		count--;
	}
		add->firstdig = ans;
		if(a->sign == NEG && a->sign == NEG)
			add->sign = NEG;
		else
			add->sign = POS;
		node *s;
		s = (node *)malloc(sizeof(node));
		if(add->sign == POS)
			s->n = '+';
		else if(add->sign == NEG)
			s->n = '-';
		s->next = ans;
		ans->prev = s;
		s->prev = NULL;
		ans = s;
		add->head = ans;
		add->digno = count + 1;
		addition = 0;
		return add;
	}
}

Integer *SubstractIntegers(Integer *a, Integer *b){
	int count = 0;
	substraction = 1;
//	printf("In sub addition is %d and substraction is %d\n", addition, substraction);
	Integer *sub;
	sub = (Integer *)malloc(sizeof(Integer));
//	print_number(a);
//	printf("\n-\n\n");
//	print_number(b);
	node *ans, *num1, *num2;
	if(((a->sign == NEG && b->sign == POS) || (a->sign == POS && b->sign == NEG)) && !addition){
//printf("WHATS YOUR PROBLEM\n");
		sub = AddIntegers(a, b);
		if(b->sign == NEG)
			sub->sign = POS;
		else
			sub->sign = NEG;
		return sub;
	}
	if(GreaterInteger(b, a)){
//	printf("hey you are in the greater integer if condition\n");
		Integer *temp;
		temp = a;
		a = b;
		b = temp;
		sub->sign = NEG;
	}
	else
		sub->sign = POS;
	ans = (node *)malloc(sizeof(node));
	num1 = a->lastdig;
	num2 = b->lastdig;	
	int borrow = 0;
	int answer, n1, n2;

	while(num1->prev && num2->prev){
		answer = (num1->n - '0') - ( num2->n - '0') - borrow;
		ans->n = answer + '0';
		if((ans->n - '0') < 0){
			answer = 10 + (num1->n - '0') - (num2->n - '0') - borrow;
			ans->n = answer + '0';
			borrow = 1;
		}
		else
			borrow = 0;
//printf("%c ", ans->n);
		ans->prev = (node *)malloc(sizeof(node));
		ans->prev->next = ans;
		ans = ans->prev;
		num1 = num1->prev;
		num2 = num2->prev;
		count++;
	}

	while(num1->prev){
		answer = num1->n - '0' - borrow;
		ans->n = answer + '0';
                if((ans->n - '0') < 0){
                        answer = 10 + num1->n - '0' - borrow;
			ans->n = answer + '0';
                        borrow = 1;
                }

                else
                        borrow = 0;
//printf("%c ", ans->n);
		ans->prev = (node *)malloc(sizeof(node));
		ans->prev->next = ans;
		ans = ans->prev;
		num1 = num1->prev;
		count++;
	}
	/*while(num2->prev){
		answer = num2->n - '0' - borrow;
		ans->n = answer + '0';
                if((ans->n - '0') < 0){
			answer = answer * (-1);
                        ans->n = ans->n * (-1);
                        borrow = 1;
                }
                else
                        borrow = 0;

		ans->prev = (node *)malloc(sizeof(node));
		ans->prev->next = ans;
		ans = ans->prev;
		num2 = num2->prev;
		count++;
	}*/
	ans->prev = NULL;
//printf("lololol   %c |||", ans->n);
count--;
	ans = ans->next;
	while(ans->n == '0'){
//printf("check for zeroes\n");
		ans = ans->next;
		count--;
	}
	sub->firstdig = ans;
//	printf("The firstdig is %d\n", ans->n);
//	printf("the subfirstdig is %d\n", sub->firstdig->n);
	sub->digno = count + 1;
	substraction = 0;
	if(a->sign == NEG && b->sign == NEG){
		if(sub->sign == NEG)
			sub->sign = POS;
		else
			sub->sign = NEG;	
	}
		node *s;
		s = (node *)malloc(sizeof(node));
		if(sub->sign == POS)
			s->n = '+';
		else if(sub->sign == NEG)
			s->n = '-';
		s->next = ans;
		//sub->prev = s;
		s->prev = NULL;
		ans = s;
		sub->head = ans;
	return sub;


}
void print_number(Integer *number){
	node * temp;
	
	temp = number->head;
	printf("[ ");
	while(temp){
		printf("%c ", temp->n);
		temp = temp->next;
	}
	printf("]\n");
	printf("Number of digits = %d\nSign is %d\n", number->digno, number->sign);
	
}
/*Checks if a is greater than b*/
int GreaterInteger(Integer *a, Integer *b){
//printf("hey\n");
	if(a->digno > b->digno)
		return 1;
	else if(a->digno < b->digno)
		return 0;
	else{
		node *numa, *numb;
		numa = a->firstdig;
		numb = b->firstdig;
//printf("2\n");
		while(numa->n - '0' == numb->n && numa - '0'){
			numa = numa->next;
			numb = numb->next;
		}
//printf("3\n");
		if(numa->n - '0'> numb->n - '0')
			return 1;
		else 
			return 0;
	}
}
