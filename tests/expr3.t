{
        int x; int y; bool r;

        r = !(x < y);

	r = !!(x == y);

	if( !(x > y) ) r = true;
	else r = false;

	if( !!(x != y) ) r = true;
	else r = false;

}
