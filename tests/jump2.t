{
        int x; int y; int a; int b; bool r;

	r = true;

	r = false;

	r = a < b;

	r = x <= y;

	r = a == b;

	r = x != y;

	r = a >= b;

	r = x > y;

	r = x < 100 || x > 200;

	r = a < 100 && a > 200;

	r = x < 100 || (x > 200 && x != y);

	r = a < 100 || (a > 200 && a != 150) || a != 0;

	r = x > 200 && x != b || x < 100;

	r = a < 100 || a > 200 && a != b;
}
