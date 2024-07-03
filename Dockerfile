FROM openjdk:17-jdk-slim-buster
COPY build/libs/integrity-check-0.0.1-SNAPSHOT.jar integrity-check.jar
ENTRYPOINT ["java", "-jar" , "integrity-check.jar"]
