package org.abl.aero.datasets.notam;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.repository.query.Param;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Query;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

// Hypermedia as the Engine of Application State (HATEOAS)
@Api(tags = "Notam Entity")
@RepositoryRestResource(collectionResourceRel = "notam", path = "notam")
public interface NotamRepository extends MongoRepository<NotamItem, String> {

  @ApiOperation("Find all Notams by location.")
  List<NotamItem> findByLocation(@Param("location") String location);

  @ApiOperation("Find all Notams by area.")
  List<NotamItem> findByArea(@Param("area") String area);

  @ApiOperation("Notam text search.")
  @Query("{'message':{'$regex':'?0','$options':'i'}}")
  Page<NotamItem> searchByMessage(String pattern, Pageable page);

}