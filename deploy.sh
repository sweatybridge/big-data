#!/bin/sh
# only works if you have setup ssh key authentication

# replace with your username
UN=qh812

WEB=dist
PROJ=/vol/project/2013/163/g1316313
HN=svnuser.doc.ic.ac.uk

ssh $UN@$HN "cd $PROJ; umask 002; rm -rf $WEB"
for dir in `find $WEB -type d`
do
	ssh $UN@$HN "cd $PROJ; umask 002; mkdir $dir"
	scp -p $dir/* $UN@$HN:$PROJ/$dir
done
