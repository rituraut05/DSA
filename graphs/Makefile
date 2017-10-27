program: graph.o main.o queue.o
	cc -g graph.o main.o queue.o -o program
graph.o: graph.c graph.h
	cc -g -c graph.c -Wall
main.o: main.c graph.h
	cc -g -c main.c -Wall
queue.o: queue.c queue.h 
	cc -g -c queue.c -Wall
