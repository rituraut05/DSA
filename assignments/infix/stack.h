#define MAX 128
struct opndstack{
int top;
int a[MAX];
}opndstack;

struct optrstack{
int top;
char a[MAX];
}optrstack;

void PushOpnd(struct opndstack *s, int num);
int PopOpnd(struct opndstack *s);
void PushOptr(struct optrstack *s, char op);
char PopOptr(struct optrstack *s);
int emptyOptr(struct optrstack *s);
int fullOptr(struct optrstack *s);
int emptyOpnd(struct opndstack *s);
int fullOpnd(struct opndstack *s);

