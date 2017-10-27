typedef struct animal {
	char name[16];
	void (*talk)(void);
};
void roar(void) {
	printf("I am roaring\n");
}
void meow(void) {
	printf("I am meowing\n");
}
int main() {
	animal tiger, cat;
	tiger.talk = roar;
	cat.talk = meow;

	tiger.talk();
	cat.talk();
	
}
