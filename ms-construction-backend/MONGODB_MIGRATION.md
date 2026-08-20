# Switching from H2 to MongoDB

You mentioned you'll give me a MongoDB URL later. Important: **this is not a one-line config
change.** H2 (via Spring Data JPA) is a relational database — your entities are `@Entity`
classes with `@Id`, `@Column`, etc., and repositories extend `JpaRepository`. MongoDB is a
document database — Spring Data MongoDB uses `@Document` instead of `@Entity`, and repositories
extend `MongoRepository` instead of `JpaRepository`. The annotations aren't interchangeable.

Here's exactly what changes when you're ready:

## 1. Swap the dependency in `pom.xml`
Remove:
```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```
And also remove `spring-boot-starter-data-jpa`. Add:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

## 2. Update `application.properties`
Replace the H2 datasource lines with:
```properties
spring.data.mongodb.uri=<the MongoDB connection string you'll give me>
```

## 3. Update every entity class
Change, for example, `Project.java`:
```java
// Before (JPA)
@Entity
@Table(name = "project")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    ...
}

// After (MongoDB)
@Document(collection = "projects")
public class Project {
    @Id
    private String id;   // MongoDB IDs are strings (ObjectId), not auto-increment Longs
    ...
}
```
Do this for all six model classes: `CompanyInfo`, `ServiceItem`, `Project`, `GalleryImage`,
`ContactQuery`, `AdminUser`. The `id` type change from `Long` to `String` also needs to
ripple into the repository interfaces and any DTOs that reference IDs.

## 4. Update every repository interface
```java
// Before
public interface ProjectRepository extends JpaRepository<Project, Long> { ... }

// After
public interface ProjectRepository extends MongoRepository<Project, String> { ... }
```

## 5. Remove H2-console config
`spring.h2.console.enabled` and the related security "permit /h2-console/**" rule in
`SecurityConfig.java` are H2-specific and should be deleted.

## Recommendation
When you're ready to do this, send me the MongoDB URL and I'll make all of the above changes
for you in one pass rather than you doing it piecemeal — it's about 20 minutes of mechanical
but easy-to-get-wrong work (mostly the `Long` → `String` ID change touching several files).
