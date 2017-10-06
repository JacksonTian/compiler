build: test

test:
	@mkdir -p tmp
	@for i in `(cd tests; ls *.t | sed -e 's/.t$$//')`;\
		do echo $$i.t;\
		 ./bin/main < tests/$$i.t > tmp/$$i.i;\
	done

clean:
	rm -rf tests/*.i

lint:
	npm run lint
