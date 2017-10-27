#include <stdio.h>
/*
 Function Pointers. 

 Function pointer is a pointer.
 It is a variable (not a function), like int i.
 It can store address of a function. (the address of the code of the function in memory)
 Dereferncing a function pointer is possible using ()
 Derefrencing a function pointer, will call the function it is pointing to. 

 Function pointer has a type : signature of the function
 */
void h(int (*gp) (int), int n) {
	printf("%d\n", gp(n));
}
int g(int y) {
	return y + 5;
}
int f(int x) {
	return x + 2;
}
int main() {
	int n;
	int (*fp)(int);
	scanf("%d", &n);
	fp = f;
	h(fp, n);
	fp = g;
	h(fp, n);
	h(f, n);
	h(g, n);
	return 0;	
}
/*void myprint(char* x) {
      printf("%s\n", x); 
  }

  int main() {
     char* s = "hello";
     void (*test)(char*);
     void (*test2)(char*);

     test = myprint;
     test2 = &myprint;

     test(s);
     (*test)(s);
     test2(s);
     (*test2)(s);

  }
All of the above code is valid

Dereferencing or taking the address of a function just evaluates to a pointer to that function, and dereferencing a function pointer just evaluates back to the function pointer.

This behavior is (thus obviously) very different from how the unary & and * operators works for normal variables.

So,

test2 = myprint;
test2 = &myprint;
test2 = *myprint;
test2 = **********myprint;

All just do exactly the same, gives you a function pointer to myprint

Similarly,

test2(s);
(*test2)(s);
(***********test2)(s);

Does the same, call the function pointer stored in test2. Because C says it does.
*/
