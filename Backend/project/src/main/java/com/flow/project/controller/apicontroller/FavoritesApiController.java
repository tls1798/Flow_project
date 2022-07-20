package com.flow.project.controller.apicontroller;

import com.flow.project.domain.Favorites;
import com.flow.project.service.FavoritesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FavoritesApiController {

    final FavoritesService favoritesService;

    @PostMapping("/favorites")
    public ResponseEntity<?> addFavorite(@RequestBody Favorites favorite) {
        if (favoritesService.addFavorite(favorite))
            return ResponseEntity.ok(favorite);
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/favorites")
    public ResponseEntity<?> removeRoom(@RequestBody Favorites favorite) {
        return ResponseEntity.ok(favoritesService.removeFavorite(favorite));
    }
}
