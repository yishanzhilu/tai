BUILD_ID=`cat ./.next/BUILD_ID`

docker build . -t tai:"$BUILD_ID"
