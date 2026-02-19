#!/bin/bash
docker exec -i gegeDot-mysql-1 mysql -u root -proot gegeDot < scripts/cleanup_and_add_catherine_test.sql
