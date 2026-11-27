import bpy
import os

src = "/Users/zhuchengbin/Downloads/Blend_7277/Blend_7277/Blend_7277.blend"
out_jpg = "/Users/zhuchengbin/Downloads/个人网页/public/images/projects/studio/blend-7277.jpg"

bpy.ops.wm.open_mainfile(filepath=src)
scene = bpy.context.scene

# Prefer Cycles if available for more controlled exposure; fall back to Eevee.
engines = bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items.keys()
if "CYCLES" in engines:
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 64
    scene.cycles.use_adaptive_sampling = True
    try:
        scene.cycles.use_denoising = True
    except Exception:
        pass
elif "BLENDER_EEVEE_NEXT" in engines:
    scene.render.engine = "BLENDER_EEVEE_NEXT"
else:
    scene.render.engine = "BLENDER_EEVEE"

# Pull exposure down and keep highlights from blowing out.
view = scene.view_settings
view.view_transform = "Filmic"
view.look = "Medium High Contrast"
view.exposure = -1.15
view.gamma = 1.0

try:
    scene.eevee.use_bloom = False
except Exception:
    pass

scene.render.filepath = out_jpg
scene.render.image_settings.file_format = "JPEG"
scene.render.image_settings.quality = 90
scene.render.resolution_x = 1600
scene.render.resolution_y = 1200
scene.render.resolution_percentage = 100
scene.render.film_transparent = False
scene.render.use_compositing = True

os.makedirs(os.path.dirname(out_jpg), exist_ok=True)
bpy.ops.render.render(write_still=True)
print("POSTER_OK", out_jpg, os.path.getsize(out_jpg))
