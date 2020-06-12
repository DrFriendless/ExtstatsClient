# How to build and deploy this component

To build, do

    ./package.sh
    
That will compile and copy the result to the static area.
Then do

    cd ..
    ./package.sh
    
That will clear the staging area, rebuild Gatsby (which is the containing pages) and copy the src and static areas to staging.
In the staging area there will now be some files for sending to S3.

Do

    ./testdeploy.sh
    
to copy the files to the test site, test.drfriendless.com.
If that 

