#include<stdio.h>
#include<string.h>
void merge(char *l, char *r, char *a){
	int i, j, k, nl, nr;
	nl = strlen(l);
	nr = strlen(r);
	while(i < nl && j < nr){
		if(l[i] < r[j]){
			a[k] = l[i];
			i++;
		}
		else{
			a[k] = r[j];
			j++;
		}
		k++;
	}
	while(i < nl){
		a[k] = l[i];
		k++;
		i++;
	}
	while(j < nl){
		a[k] = r[j];
		k++;
		j++;
	}
}
int main(){
	merge(l, r);
	return 0;
}
