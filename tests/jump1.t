{
        int x; int y; int a; int b;

	if( true ) a = 0;

	if( false ) x = 0;

	if ( a < b ) a = b;

	if ( x <= y ) x = y;

	if ( a == b ) a = b;

	if ( x != y ) x = y;

	if ( a >= b ) b = a;

	if ( x > y ) y = x;

	if ( a == b ) ;

        if( x < 100 || x > 200 ) x = 0;

        if( a < 100 && a > 200 ) b = 0;

        if( x < 100 || (x > 200 && x != y) ) x = 0;

        if( a < 100 || (a > 200 && a != 150) || a != 0 ) a = 0;

        if( x > 200 && x != b || x < 100 ) x = 0;

        if( a < 100 || a > 200 && a != b ) a = 0;
}
