#include<stdio.h>
struct test {
        char data;
        struct test *one;
        struct test *two;
};
typedef struct test test;
int main() {
        test *p, *q, *r;
        int i, j;
        /* assume that all mallocs succeed */
        p = (test *)malloc(sizeof(test));
        r = (test *)malloc(sizeof(test));
        q = p;
        for(i = 0; i < 3; i++) {
                p->two = r;
                r->two = p;
                p->one = (test *)malloc(sizeof(test));
                p = p->one;
        }
        p->one = p->two = q;
        q->one = q->two = r;
	return 0;
}
