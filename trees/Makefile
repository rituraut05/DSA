try: tree.o usetree.o  printtree.o queue.o
	cc *.o -o try -lm
tree.o: tree.c tree.h
	cc -c tree.c -Wall
usetree.o: usetree.c tree.h
	cc -c usetree.c -Wall
printtree.o: printtree.c tree.h
	cc -c printtree.c -Wall
queue.o: queue.c queue.h
	cc -c queue.c -Wall
